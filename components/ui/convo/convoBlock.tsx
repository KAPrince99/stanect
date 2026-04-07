"use client";

import { memo, useState } from "react";

import { getVapiSdk } from "@/lib/vapiSdk";
import { useConvoStore } from "@/store/use-convo-store";
import { CompanionProps } from "@/types/types";

import ConvoActionBar from "./ConvoActionBar";
import type { ConvoStatusView } from "./convo-status-config";
import ConvoStatusHero from "./ConvoStatusHero";

interface ConvoBlockProps {
  isDesktop: boolean;
  companion: CompanionProps;
  id: string;
  currentStatus: ConvoStatusView;
  setShowTranscript: (value: boolean) => void;
}

function ConvoBlock({
  isDesktop,
  companion,
  id,
  currentStatus,
  setShowTranscript,
}: ConvoBlockProps) {
  const { callStatus, isMuted, setMuted, timeLeft, startCall, endCall } =
    useConvoStore();

  const [loadingMute, setLoadingMute] = useState(false);
  const [loadingStart, setLoadingStart] = useState(false);
  const [loadingEnd, setLoadingEnd] = useState(false);

  const isCallInProgress =
    callStatus === "ACTIVE" || callStatus === "CONNECTING";

  const timeLeftDisplay =
    timeLeft !== null
      ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60)
          .toString()
          .padStart(2, "0")}`
      : "";

  // Async-safe mute toggle
  const handleMuteToggle = async () => {
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
  };

  // Async-safe start call
  const handleStartCall = async () => {
    if (!companion.assistant_id || isCallInProgress) return;
    setLoadingStart(true);
    try {
      await startCall(companion.assistant_id, Number(companion.duration) || 2);
    } finally {
      setLoadingStart(false);
    }
  };

  // Async-safe end call
  const handleEndCall = async () => {
    if (!isCallInProgress) return;
    setLoadingEnd(true);
    try {
      await endCall();
    } finally {
      setLoadingEnd(false);
    }
  };

  return (
    <div className="relative z-10 flex h-full flex-1 flex-col items-center justify-between gap-y-15 px-2 md:gap-y-0">
      <ConvoStatusHero
        companionName={companion.companion_name || "Your AI Companion"}
        callStatus={callStatus}
        currentStatus={currentStatus}
        timeLeftDisplay={timeLeftDisplay}
        isCallInProgress={isCallInProgress}
      />

      <ConvoActionBar
        companionId={id}
        isDesktop={isDesktop}
        isCallInProgress={isCallInProgress}
        isMuted={isMuted}
        hasAssistantId={Boolean(companion.assistant_id)}
        loadingMute={loadingMute}
        loadingStart={loadingStart}
        loadingEnd={loadingEnd}
        setShowTranscript={setShowTranscript}
        onStartCall={handleStartCall}
        onMuteToggle={handleMuteToggle}
        onEndCall={handleEndCall}
      />
    </div>
  );
}

export default memo(ConvoBlock);
