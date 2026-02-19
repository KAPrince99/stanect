import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getVapiSdk } from "@/lib/vapiSdk";
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

  setCallStatus: (status: CallStatus) => void;
  setMuted: (muted: boolean) => void;
  setShowEndModal: (show: boolean) => void;
  addMessage: (msg: any) => boolean;
  tickTimer: () => void;
  startCall: (assistantId: string, durationMinutes: number) => Promise<void>;
  endCall: () => Promise<void>;
  clearChat: () => void;
}

export const useConvoStore = create<ConvoState>()(
  persist(
    (set, get) => ({
      callStatus: "INACTIVE",
      isMuted: false,
      messages: [],
      timeLeft: null,
      showEndModal: false,

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
          getVapiSdk()
            .then((vapi) => vapi.stop())
            .catch(() => {});

          set({
            timeLeft: 0,
            showEndModal: true,
            callStatus: "INACTIVE",
          });

          broadcastSync({
            timeLeft: 0,
            showEndModal: true,
            callStatus: "INACTIVE",
          });
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
        });

        broadcastSync({
          callStatus: "CONNECTING",
          timeLeft: initialSeconds,
        });

        try {
          const vapi = await getVapiSdk();

          await vapi.start(assistantId, {
            maxDurationSeconds: initialSeconds,
          });
        } catch (e) {
          releaseCallOwnership();
          set({ callStatus: "ERROR" });
        }
      },

      /* ------------------------------- CALL END ------------------------------ */

      endCall: async () => {
        try {
          const vapi = await getVapiSdk();
          await vapi.stop();
        } catch (e) {
          console.error("Error stopping call:", e);
        }

        releaseCallOwnership();

        set({ callStatus: "INACTIVE" });
        broadcastSync({ callStatus: "INACTIVE" });
      },
    }),
    {
      name: "stanect-convo-storage",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        messages: state.messages.slice(-50),
        timeLeft: state.timeLeft,
        callStatus: state.callStatus,
        isMuted: state.isMuted,
      }),
    },
  ),
);

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
