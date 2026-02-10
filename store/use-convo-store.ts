import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { vapiSdk } from "@/lib/vapiSdk";

export type CallStatus = "INACTIVE" | "CONNECTING" | "ACTIVE" | "ERROR";

export type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

interface ConvoState {
  callStatus: CallStatus;
  isMuted: boolean;
  messages: Message[];
  timeLeft: number | null;
  showEndModal: boolean;

  // Actions
  setCallStatus: (status: CallStatus) => void;
  setMuted: (muted: boolean) => void;
  setShowEndModal: (show: boolean) => void;
  addMessage: (msg: any) => boolean;
  tickTimer: () => void;
  startCall: (assistantId: string, durationMinutes: number) => Promise<void>;
  endCall: () => void;
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

      setCallStatus: (callStatus) => set({ callStatus }),
      setMuted: (isMuted) => set({ isMuted }),
      setShowEndModal: (showEndModal) => set({ showEndModal }),

      clearChat: () =>
        set({ messages: [], callStatus: "INACTIVE", timeLeft: null }),

      addMessage: (msg) => {
        if (
          (msg.type === "transcript" || msg.type === "speech") &&
          msg.transcriptType === "final" &&
          msg.transcript
        ) {
          const newContent = msg.transcript.trim();
          const currentMessages = get().messages;

          const isDuplicate = currentMessages
            .slice(0, 5)
            .some((m) => m.content === newContent && m.role === msg.role);

          if (!isDuplicate) {
            set({
              messages: [
                {
                  id: msg.id || `${Date.now()}`,
                  role: msg.role,
                  content: newContent,
                },
                ...currentMessages,
              ],
            });
            return true;
          }
        }
        return false;
      },

      tickTimer: () => {
        const { timeLeft, callStatus } = get();
        if (callStatus !== "ACTIVE" || timeLeft === null) return;

        if (timeLeft <= 1) {
          vapiSdk.stop();
          set({ timeLeft: 0, showEndModal: true, callStatus: "INACTIVE" });
        } else {
          set({ timeLeft: timeLeft - 1 });
        }
      },

      startCall: async (assistantId, durationMinutes) => {
        const initialSeconds = durationMinutes * 60;
        set({
          callStatus: "CONNECTING",
          messages: [],
          timeLeft: initialSeconds,
          isMuted: false,
        });

        try {
          await vapiSdk.start(assistantId, {
            maxDurationSeconds: initialSeconds,
          });
        } catch (e) {
          set({ callStatus: "ERROR" });
        }
      },

      endCall: () => {
        vapiSdk.stop();
        set({ callStatus: "INACTIVE" });
      },
    }),
    {
      name: "stanect-convo-storage",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        messages: state.messages,
        timeLeft: state.timeLeft,
      }),
    },
  ),
);
