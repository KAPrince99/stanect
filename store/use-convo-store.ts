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

/** Who is talking right now, or null when it is quiet. */
export type Speaker = "assistant" | "user";

type SpeechUpdateEvent = {
  type: "speech-update";
  status: "started" | "stopped";
  role: Speaker;
};

function isSpeechUpdateEvent(msg: VapiMessageEvent): msg is SpeechUpdateEvent {
  if (typeof msg !== "object" || msg === null) return false;

  const { type, status, role } = msg as Record<string, unknown>;

  return (
    type === "speech-update" &&
    (status === "started" || status === "stopped") &&
    (role === "assistant" || role === "user")
  );
}

function isUserInterruptedEvent(msg: VapiMessageEvent): boolean {
  return (
    typeof msg === "object" &&
    msg !== null &&
    (msg as Record<string, unknown>).type === "user-interrupted"
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
  /** Who is speaking right now. Local to this tab, never synced. */
  speaker: Speaker | null;
  /** True while the mic level says the user is talking (faster than Vapi). */
  localVoiceActive: boolean;
  messages: Message[];
  timeLeft: number | null;
  showEndModal: boolean;
  showTranscript: boolean;
  activeCallId: string | null;
  companionId: string | null;

  setCallStatus: (status: CallStatus) => void;
  setMuted: (muted: boolean) => void;
  /** Feed raw Vapi `message` events; only speech updates change `speaker`. */
  applySpeechEvent: (msg: VapiMessageEvent) => void;
  /** Fed by the mic-level detector. Makes the user's ring react right away. */
  setUserSpeaking: (active: boolean) => void;
  /** Drop the speaking ring without waiting for Vapi (stuck-ring safety net). */
  clearSpeaker: () => void;
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
  speaker: null,
  localVoiceActive: false,
  messages: [],
  timeLeft: null,
  showEndModal: false,
  showTranscript: false,
  activeCallId: null,
  companionId: null,

  setCallStatus: (callStatus) => {
    // Nobody speaks once the call is over.
    const callOver = callStatus === "INACTIVE" || callStatus === "ERROR";
    set(
      callOver
        ? { callStatus, speaker: null, localVoiceActive: false }
        : { callStatus },
    );
    broadcastSync({ callStatus });
  },

  setMuted: (isMuted) => {
    // A muted mic is never "speaking", even if a late event is still in flight.
    set((state) => ({
      isMuted,
      speaker: isMuted && state.speaker === "user" ? null : state.speaker,
      localVoiceActive: isMuted ? false : state.localVoiceActive,
    }));
    broadcastSync({ isMuted });
  },

  clearSpeaker: () => set({ speaker: null, localVoiceActive: false }),

  setUserSpeaking: (active) => {
    if (!active) {
      set((state) => ({
        localVoiceActive: false,
        speaker: state.speaker === "user" ? null : state.speaker,
      }));
      return;
    }

    // The mic only counts during a live, unmuted call.
    const { callStatus, isMuted } = get();
    if (callStatus !== "ACTIVE" || isMuted) return;

    set({ localVoiceActive: true, speaker: "user" });
  },

  applySpeechEvent: (msg) => {
    const { callStatus, isMuted, speaker, localVoiceActive } = get();
    if (callStatus === "INACTIVE" || callStatus === "ERROR") return;

    if (isUserInterruptedEvent(msg)) {
      // The user cut in, so the assistant is no longer talking.
      if (speaker === "assistant") set({ speaker: null });
      return;
    }

    if (!isSpeechUpdateEvent(msg)) return;

    if (msg.status === "started") {
      if (msg.role === "user" && isMuted) return;
      set({ speaker: msg.role });
      return;
    }

    // The server's "user stopped" lands after the mic already went quiet in
    // the usual case, but can also land mid-sentence. While the mic still hears
    // the user, the mic decides; it clears the ring itself when it goes quiet.
    if (msg.role === "user" && localVoiceActive) return;

    // "stopped": only clear if that same side is the current speaker, so a late
    // stop from the previous speaker cannot wipe out the one who just started.
    if (speaker === msg.role) set({ speaker: null });
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
      speaker: null,
      localVoiceActive: false,
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
      speaker: null,
      localVoiceActive: false,
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
      speaker: null,
      localVoiceActive: false,
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
      set({
        callStatus: "ERROR",
        speaker: null,
        localVoiceActive: false,
        activeCallId: null,
      });
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
