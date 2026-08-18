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
import { isCallOwner, releaseCallOwnership } from "@/lib/tabCallLock";
import { extractVapiCallId, getVapiSdk, type VapiSDK } from "@/lib/vapiSdk";
import { useConvoStore } from "@/store/use-convo-store";

interface UseConvoSessionOptions {
  assistantId?: string | null;
  durationMinutes?: number;
  userId?: string | null;
}

type CachedUserUsage = {
  daily_seconds_used?: number | null;
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
    total_lifetime_seconds: usage.totalLifetimeSeconds,
  } as T;
}

function formatTimeLeft(timeLeft: number | null) {
  if (timeLeft === null) return "";
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function useConvoSession({
  assistantId,
  durationMinutes = 2,
  userId,
}: UseConvoSessionOptions = {}) {
  const queryClient = useQueryClient();
  const [isDesktop, setIsDesktop] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [loadingMute, setLoadingMute] = useState(false);
  const [loadingStart, setLoadingStart] = useState(false);
  const [loadingEnd, setLoadingEnd] = useState(false);

  const sessionCallIdRef = useRef<string | null>(null);
  const vapiRef = useRef<VapiSDK | null>(null);

  const {
    callStatus,
    isMuted,
    timeLeft,
    showEndModal,
    activeCallId,
    setCallStatus,
    addMessage,
    tickTimer,
    setMuted,
    setShowEndModal,
    startCall,
    endCall,
  } = useConvoStore();

  const isCallInProgress =
    callStatus === "ACTIVE" || callStatus === "CONNECTING";
  // Timer / live controls only kick in once Vapi fires call-start → ACTIVE.
  const isCallLive = callStatus === "ACTIVE";
  const hasAssistantId = Boolean(assistantId);
  const timeLeftDisplay = formatTimeLeft(timeLeft);

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
    const onCallStart = () => {
      setCallStatus("ACTIVE");
      setShowTranscript(true);
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
      ]);
    };

    const handleVapiMessage = (message: unknown) => {
      const wasAdded = addMessage(message);
      if (wasAdded) playPop();
    };

    const handleVapiError = (error: unknown) => {
      const text =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : JSON.stringify(error ?? "");

      // Daily/Vapi logs this on normal hangup / max-duration end — not a real failure.
      if (
        /meeting has ended|meeting ended|ejection|meeting has been destroyed/i.test(
          text,
        )
      ) {
        return;
      }

      setCallStatus("ERROR");
    };

    const setupVapiListeners = async () => {
      const vapi = await getVapiSdk();
      vapiRef.current = vapi;

      vapi.on("call-start", onCallStart);
      vapi.on("call-start-success", onCallStartSuccess);
      vapi.on("call-end", onCallEnd);
      vapi.on("message", handleVapiMessage);
      vapi.on("error", handleVapiError);
    };

    setupVapiListeners();

    return () => {
      const vapi = vapiRef.current;
      if (!vapi) return;

      vapi.off("call-start", onCallStart);
      vapi.off("call-start-success", onCallStartSuccess);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", handleVapiMessage);
      vapi.off("error", handleVapiError);
    };
  }, [
    addMessage,
    assistantId,
    playPop,
    queryClient,
    setCallStatus,
    setMuted,
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
    callStatus,
    isMuted,
    isCallInProgress,
    isCallLive,
    hasAssistantId,
    timeLeftDisplay,
    showEndModal,
    setShowEndModal,
    showTranscript,
    setShowTranscript,
    isDesktop,
    loadingMute,
    loadingStart,
    loadingEnd,
    onStartCall,
    onMuteToggle,
    onEndCall,
  };
}
