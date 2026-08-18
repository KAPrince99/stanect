import { create } from "zustand";
import { extractVapiCallId, getVapiSdk } from "@/lib/vapiSdk";
import {
  claimCallOwnership,
  releaseCallOwnership,
  isCallOwner,
  recoverStaleLock,
} from "@/lib/tabCallLock";

export type CallStatus = "INACTIVE" | "CONNECTING" | "ACTIVE" | "ERROR";

export type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

/* -------------------------------------------------------------------------- */
/*                          MULTI TAB SYNC HELPERS                            */
/* -------------------------------------------------------------------------- */

const SYNC_KEY = "stanect-convo-sync";

function broadcastSync(data: any) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SYNC_KEY, JSON.stringify({ ...data, ts: Date.now() }));
}

interface ConvoState {
  callStatus: CallStatus;
  isMuted: boolean;
  messages: Message[];
  timeLeft: number | null;
  showEndModal: boolean;
  activeCallId: string | null;

  setCallStatus: (status: CallStatus) => void;
  setMuted: (muted: boolean) => void;
  setShowEndModal: (show: boolean) => void;
  addMessage: (msg: any) => boolean;
  tickTimer: () => void;
  startCall: (assistantId: string, durationMinutes: number) => Promise<void>;
  endCall: () => Promise<void>;
  clearChat: () => void;
}

export const useConvoStore = create<ConvoState>()((set, get) => ({
  callStatus: "INACTIVE",
  isMuted: false,
  messages: [],
  timeLeft: null,
  showEndModal: false,
  activeCallId: null,

  setCallStatus: (callStatus) => {
    set({ callStatus });
    broadcastSync({ callStatus });
  },

  setMuted: (isMuted) => {
    set({ isMuted });
    broadcastSync({ isMuted });
  },

  setShowEndModal: (showEndModal) => {
    set({ showEndModal });
    broadcastSync({ showEndModal });
  },

  clearChat: () =>
    set({
      messages: [],
      callStatus: "INACTIVE",
      timeLeft: null,
      activeCallId: null,
    }),

  /* ----------------------------- MESSAGE SAFE ---------------------------- */

  addMessage: (msg) => {
    if (
      (msg.type === "transcript" || msg.type === "speech") &&
      msg.transcriptType === "final" &&
      msg.transcript
    ) {
      const newContent = msg.transcript.trim();
      let wasAdded = false;

      set((state) => {
        // check LAST 5 messages (not first 5)
        const isDuplicate = state.messages
          .slice(-5)
          .some((m) => m.content === newContent && m.role === msg.role);

        if (isDuplicate) return state;

        wasAdded = true;

        return {
          messages: [
            ...state.messages,
            {
              id: msg.id || crypto.randomUUID(),
              role: msg.role,
              content: newContent,
            },
          ],
        };
      });

      return wasAdded;
    }

    return false;
  },

  /* ----------------------------- TIMER SAFE ----------------------------- */

  tickTimer: () => {
    const { timeLeft, callStatus } = get();

    if (callStatus !== "ACTIVE" || timeLeft === null) return;

    if (timeLeft <= 1) {
      set({
        timeLeft: 0,
        showEndModal: true,
      });
      broadcastSync({
        timeLeft: 0,
        showEndModal: true,
      });

      // Let Vapi/Daily end once; call-end listener owns INACTIVE cleanup.
      getVapiSdk()
        .then((vapi) => vapi.stop())
        .catch(() => {});
    } else {
      set((state) => {
        const next = (state.timeLeft ?? 1) - 1;
        broadcastSync({ timeLeft: next });
        return { timeLeft: next };
      });
    }
  },

  /* ------------------------------ CALL START ----------------------------- */

  startCall: async (assistantId, durationMinutes) => {
    recoverStaleLock();

    if (!claimCallOwnership()) {
      alert("Call already active in another tab");
      return;
    }

    const initialSeconds = durationMinutes * 60;

    set({
      callStatus: "CONNECTING",
      messages: [],
      timeLeft: initialSeconds,
      isMuted: false,
      activeCallId: null,
    });

    broadcastSync({
      callStatus: "CONNECTING",
      timeLeft: initialSeconds,
    });

    try {
      const vapi = await getVapiSdk();

      const call = await vapi.start(assistantId, {
        maxDurationSeconds: initialSeconds,
      });

      const callId = extractVapiCallId(call);

      if (callId) {
        set({ activeCallId: callId });
        broadcastSync({ activeCallId: callId });
      }
    } catch (e) {
      releaseCallOwnership();
      set({ callStatus: "ERROR", activeCallId: null });
    }
  },

  /* ------------------------------- CALL END ------------------------------ */

  endCall: async () => {
    const { callStatus } = get();
    if (callStatus === "INACTIVE" || callStatus === "ERROR") {
      releaseCallOwnership();
      return;
    }

    try {
      const vapi = await getVapiSdk();
      await vapi.stop();
    } catch {
      // Daily often throws "Meeting has ended" if already tearing down.
    }

    releaseCallOwnership();
  },
}));

/* -------------------------------------------------------------------------- */
/*                           MULTI TAB LISTENER                               */
/* -------------------------------------------------------------------------- */

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key !== SYNC_KEY || !e.newValue) return;

    try {
      const data = JSON.parse(e.newValue);

      useConvoStore.setState((state) => ({
        ...state,
        ...data,
      }));
    } catch {}
  });
}
