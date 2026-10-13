"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import throttle from "lodash.throttle";
import useSound from "use-sound";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import {
  assertCanStartCall,
  finalizeCallUsage,
} from "@/app/(app)/actions/actions";
import {
  isBenignVapiHangupError,
  isUnsupportedAudioProcessorWarning,
} from "@/lib/vapi-errors";
import { isCallOwner, releaseCallOwnership } from "@/lib/tabCallLock";
import { extractVapiCallId, getVapiSdk, type VapiSDK } from "@/lib/vapiSdk";
import { utcDateKey } from "@/lib/plan-utils";
import {
  REMOTE_AUDIO_ACTIVE_LEVEL,
  createSpeakerWatchdog,
  transcriptRole,
} from "@/lib/speaker-watchdog";
import {
  VOICE_ACTIVITY,
  createVoiceActivityDetector,
} from "@/lib/voice-activity";
import {
  ASSISTANT_FULL_SCALE_LEVEL,
  USER_FULL_SCALE_LEVEL,
  createLevelSmoother,
  publishVoiceLevel,
} from "@/lib/voice-level";
import { createMicLevelMonitor, localAudioTrack } from "@/lib/mic-level";
import { useConvoStore } from "@/store/use-convo-store";

interface UseConvoSessionOptions {
  assistantId?: string | null;
  durationMinutes?: number;
  userId?: string | null;
}

type CachedUserUsage = {
  daily_seconds_used?: number | null;
  last_usage_date?: string | null;
  total_lifetime_seconds?: number | null;
};

function applyUsageToCachedUser<T>(
  old: T,
  usage: { dailySecondsUsed: number; totalLifetimeSeconds: number },
): T {
  if (!old || typeof old !== "object") return old;
  return {
    ...(old as CachedUserUsage),
    daily_seconds_used: usage.dailySecondsUsed,
    last_usage_date: utcDateKey(),
    total_lifetime_seconds: usage.totalLifetimeSeconds,
  } as T;
}

export function useConvoSession({
  assistantId,
  durationMinutes = 2,
  userId,
}: UseConvoSessionOptions = {}) {
  const queryClient = useQueryClient();
  const [isDesktop, setIsDesktop] = useState(false);
  const [loadingMute, setLoadingMute] = useState(false);
  const [loadingStart, setLoadingStart] = useState(false);
  const [loadingEnd, setLoadingEnd] = useState(false);

  const sessionCallIdRef = useRef<string | null>(null);
  const vapiRef = useRef<VapiSDK | null>(null);

  const callStatus = useConvoStore((s) => s.callStatus);
  const isMuted = useConvoStore((s) => s.isMuted);
  const showEndModal = useConvoStore((s) => s.showEndModal);
  const activeCallId = useConvoStore((s) => s.activeCallId);
  const setCallStatus = useConvoStore((s) => s.setCallStatus);
  const addMessage = useConvoStore((s) => s.addMessage);
  const applySpeechEvent = useConvoStore((s) => s.applySpeechEvent);
  const setUserSpeaking = useConvoStore((s) => s.setUserSpeaking);
  const clearSpeaker = useConvoStore((s) => s.clearSpeaker);
  const tickTimer = useConvoStore((s) => s.tickTimer);
  const setMuted = useConvoStore((s) => s.setMuted);
  const setShowEndModal = useConvoStore((s) => s.setShowEndModal);
  const setShowTranscript = useConvoStore((s) => s.setShowTranscript);
  const startCall = useConvoStore((s) => s.startCall);
  const endCall = useConvoStore((s) => s.endCall);

  const isCallInProgress =
    callStatus === "ACTIVE" || callStatus === "CONNECTING";
  // Timer / live controls only kick in once Vapi fires call-start → ACTIVE.
  const isCallLive = callStatus === "ACTIVE";
  const hasAssistantId = Boolean(assistantId);

  const [playSound] = useSound("/sounds/bubble-pop.mp3", {
    volume: 0.1,
    interrupt: true,
  });

  const playPop = useMemo(() => throttle(() => playSound(), 300), [playSound]);

  useEffect(() => {
    if (activeCallId) {
      sessionCallIdRef.current = activeCallId;
    }
  }, [activeCallId]);

  useEffect(() => {
    const handleStorageSync = () => {
      if (!isCallOwner()) {
        useConvoStore.setState({ callStatus: "INACTIVE" });
      }
    };

    window.addEventListener("storage", handleStorageSync);
    return () => window.removeEventListener("storage", handleStorageSync);
  }, []);

  useEffect(() => {
    return () => {
      playPop.cancel();
    };
  }, [playPop]);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (callStatus === "ACTIVE") {
      interval = setInterval(tickTimer, 1000);
    }

    return () => clearInterval(interval);
  }, [callStatus, tickTimer]);

  useEffect(() => {
    const attachOwnMicRef = { current: () => {} };

    const onCallStart = () => {
      setCallStatus("ACTIVE");
      setShowTranscript(true);
      attachOwnMicRef.current();
    };

    const onCallStartSuccess = (event: unknown) => {
      const callId = extractVapiCallId(event);
      if (!callId) return;
      sessionCallIdRef.current = callId;
      useConvoStore.setState({ activeCallId: callId });
    };

    const onCallEnd = async () => {
      setCallStatus("INACTIVE");
      setMuted(false);
      releaseCallOwnership();

      const callId = sessionCallIdRef.current;
      sessionCallIdRef.current = null;
      useConvoStore.setState({ activeCallId: null });

      const result = await finalizeCallUsage(callId || "", assistantId);
      if (result && "error" in result && result.error) {
        console.error("finalizeCallUsage:", result.error);
      }

      const metered =
        result &&
        "result" in result &&
        result.result &&
        typeof result.result.dailySecondsUsed === "number" &&
        typeof result.result.totalLifetimeSeconds === "number"
          ? {
              dailySecondsUsed: result.result.dailySecondsUsed,
              totalLifetimeSeconds: result.result.totalLifetimeSeconds,
            }
          : null;

      if (metered) {
        queryClient.setQueriesData({ queryKey: ["users"] }, (old: unknown) =>
          applyUsageToCachedUser(old, metered),
        );
        queryClient.setQueriesData(
          { queryKey: ["userNecessities"] },
          (old: unknown) => applyUsageToCachedUser(old, metered),
        );
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["userNecessities"] }),
        queryClient.invalidateQueries({ queryKey: ["users"] }),
        queryClient.invalidateQueries({ queryKey: ["sessions"] }),
      ]);
    };

    // The user's ring follows the mic directly: Vapi's own "user started
    // speaking" message only arrives after a server round trip (1-2s).
    const voiceDetector = createVoiceActivityDetector(setUserSpeaking);

    // Safety net: if a "stopped" message is ever lost, a ring that shows no
    // sign of life for a few seconds is cleared rather than glowing forever.
    const speakerWatchdog = createSpeakerWatchdog(() => {
      voiceDetector.reset();
      clearSpeaker();
    });

    const touchWatchdogFor = (role: "assistant" | "user") => {
      if (useConvoStore.getState().speaker === role) speakerWatchdog.touch();
    };

    const handleVapiMessage = (message: unknown) => {
      applySpeechEvent(message);

      const talkingRole = transcriptRole(message);
      if (talkingRole) touchWatchdogFor(talkingRole);

      const wasAdded = addMessage(message);
      if (wasAdded) playPop();
    };

    // Loudness for the avatars' halo. Goes through lib/voice-level, not React
    // state: readings arrive many times a second.
    const userLevel = createLevelSmoother(USER_FULL_SCALE_LEVEL);
    const assistantLevel = createLevelSmoother(ASSISTANT_FULL_SCALE_LEVEL);

    const handleLocalVolume = (level: unknown) => {
      if (typeof level !== "number") return;
      publishVoiceLevel("user", userLevel.next(level));
      if (level >= VOICE_ACTIVITY.offLevel) touchWatchdogFor("user");
      voiceDetector.push(level, {
        assistantSpeaking: useConvoStore.getState().speaker === "assistant",
      });
    };

    // Daily's local-audio-level observer never fired in this browser (the
    // companion's did). Read the same microphone track ourselves.
    const micMonitor = createMicLevelMonitor((level) => handleLocalVolume(level));
    let stopWatchingDailyTrack: (() => void) | undefined;

    const attachOwnMicMonitor = () => {
      const vapi = vapiRef.current;
      const daily = vapi?.getDailyCallObject?.() as
        | {
            on?: (event: string, cb: (event: unknown) => void) => void;
            off?: (event: string, cb: (event: unknown) => void) => void;
          }
        | null
        | undefined;

      const takeTrack = (track: MediaStreamTrack | null) => {
        if (!track) return false;
        micMonitor.attach(track);
        return true;
      };

      takeTrack(localAudioTrack(daily));

      const onTrackStarted = (event: unknown) => {
        if (typeof event !== "object" || event === null) return;
        const { track, participant } = event as {
          track?: MediaStreamTrack;
          participant?: { local?: boolean };
        };
        if (!participant?.local) return;
        if (!(track instanceof MediaStreamTrack) || track.kind !== "audio") return;
        takeTrack(track);
      };

      daily?.on?.("track-started", onTrackStarted);
      stopWatchingDailyTrack = () => daily?.off?.("track-started", onTrackStarted);

      void vapi?.startLocalAudioLevelObserver?.(100).catch(() => {
        /* Daily's observer is a bonus if it ever starts working. */
      });
    };
    attachOwnMicRef.current = attachOwnMicMonitor;

    const handleRemoteVolume = (level: unknown) => {
      if (typeof level !== "number") return;
      publishVoiceLevel("assistant", assistantLevel.next(level));
      if (level >= REMOTE_AUDIO_ACTIVE_LEVEL) touchWatchdogFor("assistant");
    };

    const isOver = (status: string) => status === "INACTIVE" || status === "ERROR";
    const stopWatchingStore = useConvoStore.subscribe((state, prev) => {
      const justMuted = state.isMuted && !prev.isMuted;
      const callJustEnded = isOver(state.callStatus) && !isOver(prev.callStatus);
      if (justMuted || callJustEnded) voiceDetector.reset();
      if (callJustEnded) {
        micMonitor.detach();
        stopWatchingDailyTrack?.();
      }

      if (state.speaker !== prev.speaker) {
        if (state.speaker) speakerWatchdog.touch();
        else speakerWatchdog.cancel();
      }
    });

    const handleVapiError = (error: unknown) => {
      if (isBenignVapiHangupError(error)) return;

      const status = useConvoStore.getState().callStatus;
      if (status === "INACTIVE" || status === "ERROR") return;

      setCallStatus("ERROR");
    };

    const setupVapiListeners = async () => {
      const originalConsoleError = console.error;
      console.error = (...args: unknown[]) => {
        const text = args.map((arg) => String(arg)).join(" ");
        if (isBenignVapiHangupError(text)) return;
        if (isUnsupportedAudioProcessorWarning(text)) {
          // Not an error: the call carries on without noise cancellation.
          // Keep it visible as a warning instead of a dev error overlay.
          console.warn(...args);
          return;
        }
        originalConsoleError.apply(console, args);
      };

      const vapi = await getVapiSdk();

      // The effect was cleaned up while the SDK was loading (Strict Mode, or
      // deps changing). Attaching now would leave listeners nothing removes.
      if (cancelled) {
        return () => {
          console.error = originalConsoleError;
        };
      }

      vapiRef.current = vapi;

      vapi.on("call-start", onCallStart);
      vapi.on("call-start-success", onCallStartSuccess);
      vapi.on("call-end", onCallEnd);
      vapi.on("message", handleVapiMessage);
      vapi.on("local-volume-level", handleLocalVolume);
      vapi.on("volume-level", handleRemoteVolume);
      vapi.on("error", handleVapiError);

      return () => {
        console.error = originalConsoleError;
      };
    };

    let restoreConsoleError: (() => void) | undefined;
    let cancelled = false;

    setupVapiListeners().then((restore) => {
      if (cancelled) {
        restore();
        return;
      }
      restoreConsoleError = restore;
    });

    return () => {
      cancelled = true;
      restoreConsoleError?.();
      stopWatchingStore();
      voiceDetector.dispose();
      speakerWatchdog.cancel();
      micMonitor.detach();
      stopWatchingDailyTrack?.();

      const vapi = vapiRef.current;
      if (!vapi) return;

      vapi.off("call-start", onCallStart);
      vapi.off("call-start-success", onCallStartSuccess);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", handleVapiMessage);
      vapi.off("local-volume-level", handleLocalVolume);
      vapi.off("volume-level", handleRemoteVolume);
      vapi.off("error", handleVapiError);
    };
  }, [
    addMessage,
    applySpeechEvent,
    assistantId,
    clearSpeaker,
    playPop,
    queryClient,
    setCallStatus,
    setMuted,
    setShowTranscript,
    setUserSpeaking,
    userId,
  ]);

  const onStartCall = useCallback(async () => {
    if (!assistantId || isCallInProgress) return;
    setLoadingStart(true);
    try {
      await assertCanStartCall();
      await startCall(assistantId, durationMinutes);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to start call",
      );
      useConvoStore.setState({ callStatus: "INACTIVE" });
    } finally {
      setLoadingStart(false);
    }
  }, [assistantId, durationMinutes, isCallInProgress, startCall]);

  const onMuteToggle = useCallback(async () => {
    if (!isCallInProgress) return;
    setLoadingMute(true);
    try {
      const vapi = await getVapiSdk();
      await vapi.setMuted(!isMuted);
      setMuted(!isMuted);
    } catch (err) {
      console.error("Failed to toggle mute:", err);
    } finally {
      setLoadingMute(false);
    }
  }, [isCallInProgress, isMuted, setMuted]);

  const onEndCall = useCallback(async () => {
    if (!isCallInProgress) return;
    setLoadingEnd(true);
    try {
      await endCall();
    } finally {
      setLoadingEnd(false);
    }
  }, [endCall, isCallInProgress]);

  return {
    hasAssistantId,
    isDesktop,
    loadingMute,
    loadingStart,
    loadingEnd,
    onStartCall,
    onMuteToggle,
    onEndCall,
  };
}
