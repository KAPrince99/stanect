"use client";

import { memo, type ReactNode } from "react";

import { CallStatus } from "@/store/use-convo-store";

import ConvoActionBar from "./ConvoActionBar";
import type { ConvoStatusView } from "./convo-status-config";
import ConvoStatusHero from "./ConvoStatusHero";

interface ConvoBlockProps {
  companionName: string;
  isDesktop: boolean;
  callStatus: CallStatus;
  currentStatus: ConvoStatusView;
  timeLeftDisplay: string;
  isCallInProgress: boolean;
  isMuted: boolean;
  hasAssistantId: boolean;
  loadingMute: boolean;
  loadingStart: boolean;
  loadingEnd: boolean;
  backAction?: ReactNode;
  deleteAction?: ReactNode;
  setShowTranscript: (value: boolean) => void;
  onStartCall: () => void | Promise<void>;
  onMuteToggle: () => void | Promise<void>;
  onEndCall: () => void | Promise<void>;
}

function ConvoBlock({
  companionName,
  isDesktop,
  callStatus,
  currentStatus,
  timeLeftDisplay,
  isCallInProgress,
  isMuted,
  hasAssistantId,
  loadingMute,
  loadingStart,
  loadingEnd,
  backAction,
  deleteAction,
  setShowTranscript,
  onStartCall,
  onMuteToggle,
  onEndCall,
}: ConvoBlockProps) {
  return (
    <div className="relative z-10 flex h-full min-h-0 w-full flex-col items-center justify-between px-2">
      {backAction ? (
        <div className="absolute top-3 left-3 z-20 sm:top-4 sm:left-4">
          {backAction}
        </div>
      ) : null}

      {deleteAction ? (
        <div className="absolute top-3 right-3 z-20 sm:top-4 sm:right-4">
          {deleteAction}
        </div>
      ) : null}

      <ConvoStatusHero
        companionName={companionName}
        callStatus={callStatus}
        currentStatus={currentStatus}
        timeLeftDisplay={timeLeftDisplay}
        isCallInProgress={isCallInProgress}
      />

      <ConvoActionBar
        isDesktop={isDesktop}
        isCallInProgress={isCallInProgress}
        isMuted={isMuted}
        hasAssistantId={hasAssistantId}
        loadingMute={loadingMute}
        loadingStart={loadingStart}
        loadingEnd={loadingEnd}
        setShowTranscript={setShowTranscript}
        onStartCall={onStartCall}
        onMuteToggle={onMuteToggle}
        onEndCall={onEndCall}
      />
    </div>
  );
}

export default memo(ConvoBlock);
