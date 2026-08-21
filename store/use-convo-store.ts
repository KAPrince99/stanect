import { create } from "zustand";
import { extractVapiCallId, getVapiSdk } from "@/lib/vapiSdk";
import { isBenignVapiHangupError } from "@/lib/vapi-errors";
import {
  claimCallOwnership,
  releaseCallOwnership,
  recoverStaleLock,
} from "@/lib/tabCallLock";

let hangupInFlight = false;
export type CallStatus = "INACTIVE" | "CONNECTING" | "ACTIVE" | "ERROR";

export type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

type VapiTranscriptEvent = {
  type: "transcript" | "speech";
  role: "assistant" | "user";
  transcriptType: string;
  transcript: string;
  id?: string;
};

/** Raw event from Vapi `message` listener; narrowed before use. */
export type VapiMessageEvent = unknown;

function isFinalTranscriptEvent(msg: VapiMessageEvent): msg is VapiTranscriptEvent {
  if (typeof msg !== "object" || msg === null) return false;

  const { type, transcriptType, transcript, role } = msg as Record<
    string,
    unknown
  >;

  return (
    (type === "transcript" || type === "speech") &&
    transcriptType === "final" &&
    typeof transcript === "string" &&
    transcript.length > 0 &&
    (role === "assistant" || role === "user")
  );
}

/* -------------------------------------------------------------------------- */
/*                          MULTI TAB SYNC HELPERS                            */
/* -------------------------------------------------------------------------- */

const SYNC_KEY = "stanect-convo-sync";

type ConvoSyncPayload = Partial<{
  callStatus: CallStatus;
  isMuted: boolean;
  showEndModal: boolean;
  timeLeft: number | null;
  activeCallId: string | null;
}>;

type StoredConvoSyncPayload = ConvoSyncPayload & { ts?: number };

function broadcastSync(data: ConvoSyncPayload) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SYNC_KEY, JSON.stringify({ ...data, ts: Date.now() }));
}

interface ConvoState {
  callStatus: CallStatus;
  isMuted: boolean;
  messages: Message[];
  timeLeft: number | null;
  showEndModal: boolean;
  showTranscript: boolean;
  activeCallId: string | null;
  companionId: string | null;

  setCallStatus: (status: CallStatus) => void;
  setMuted: (muted: boolean) => void;
  setShowEndModal: (show: boolean) => void;
  setShowTranscript: (show: boolean) => void;
  addMessage: (msg: VapiMessageEvent) => boolean;
  bindCompanion: (companionId: string) => void;
  replaceMessages: (messages: Message[]) => void;
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
  showTranscript: false,
  activeCallId: null,
  companionId: null,

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

  setShowTranscript: (showTranscript) => set({ showTranscript }),

  clearChat: () =>
    set({
      messages: [],
      callStatus: "INACTIVE",
      timeLeft: null,
      activeCallId: null,
      showTranscript: false,
      showEndModal: false,
      isMuted: false,
    }),

  bindCompanion: (companionId) => {
    const state = get();
    const live =
      state.callStatus === "ACTIVE" || state.callStatus === "CONNECTING";
    if (live && state.companionId === companionId) return;

    set({
      companionId,
      messages: [],
      callStatus: "INACTIVE",
      timeLeft: null,
      activeCallId: null,
      showTranscript: false,
      showEndModal: false,
      isMuted: false,
    });
  },

  replaceMessages: (messages) => set({ messages }),

  /* ----------------------------- MESSAGE SAFE ---------------------------- */

  addMessage: (msg) => {
    if (!isFinalTranscriptEvent(msg)) return false;

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

      // Single hangup path — avoids timer + button both calling Daily destroy.
      void get().endCall();
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
    } catch {
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

    if (hangupInFlight) return;
    hangupInFlight = true;

    try {
      const vapi = await getVapiSdk();
      await vapi.stop();
    } catch (error) {
      if (!isBenignVapiHangupError(error)) {
        console.warn("endCall:", error);
      }
    } finally {
      hangupInFlight = false;
      releaseCallOwnership();
    }
  },}));

/* -------------------------------------------------------------------------- */
/*                           MULTI TAB LISTENER                               */
/* -------------------------------------------------------------------------- */

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key !== SYNC_KEY || !e.newValue) return;

    try {
      const data = JSON.parse(e.newValue) as StoredConvoSyncPayload;

      useConvoStore.setState((state) => ({
        ...state,
        ...data,
      }));
    } catch {
      /* ignore malformed sync payloads */
    }
  });
}
