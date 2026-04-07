"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import throttle from "lodash.throttle";
import useSound from "use-sound";

import { updateUserSeconds } from "@/app/(app)/actions/actions";
import { isCallOwner } from "@/lib/tabCallLock";
import { getVapiSdk, type VapiSDK } from "@/lib/vapiSdk";
import { useConvoStore } from "@/store/use-convo-store";

export function useConvoSession() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const sessionStartTimeRef = useRef<number | null>(null);
  const vapiRef = useRef<VapiSDK | null>(null);

  const {
    callStatus,
    showEndModal,
    setCallStatus,
    addMessage,
    tickTimer,
    setMuted,
    setShowEndModal,
  } = useConvoStore();

  const [playSound] = useSound("/sounds/bubble-pop.mp3", {
    volume: 0.1,
    interrupt: true,
  });

  const playPop = useMemo(() => throttle(() => playSound(), 300), [playSound]);

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
      sessionStartTimeRef.current = Date.now();
    };

    const onCallEnd = async () => {
      setCallStatus("INACTIVE");
      setMuted(false);

      if (sessionStartTimeRef.current) {
        const durationSeconds = Math.floor(
          (Date.now() - sessionStartTimeRef.current) / 1000,
        );

        if (durationSeconds > 0) {
          await updateUserSeconds(durationSeconds);
        }

        sessionStartTimeRef.current = null;
      }
    };

    const handleVapiMessage = (message: unknown) => {
      const wasAdded = addMessage(message);
      if (wasAdded) playPop();
    };

    const setupVapiListeners = async () => {
      const vapi = await getVapiSdk();
      vapiRef.current = vapi;

      vapi.on("call-start", onCallStart);
      vapi.on("call-end", onCallEnd);
      vapi.on("message", handleVapiMessage);
      vapi.on("error", () => setCallStatus("ERROR"));
    };

    setupVapiListeners();

    return () => {
      const vapi = vapiRef.current;
      if (!vapi) return;

      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", handleVapiMessage);
    };
  }, [addMessage, playPop, setCallStatus, setMuted]);

  return {
    callStatus,
    showEndModal,
    setShowEndModal,
    showTranscript,
    setShowTranscript,
    isDesktop,
  };
}
