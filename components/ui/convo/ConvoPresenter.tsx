"use client";

import { motion } from "framer-motion";
import { memo, type ReactNode } from "react";

import { motionVariants } from "@/lib/motion";
import { CallStatus } from "@/store/use-convo-store";

import { convoStatusConfig } from "./convo-status-config";
import ConvoBlock from "./convoBlock";
import SessionEndedModal from "./sessionEndedModal";
import {
  MobileTranscriptOverlay,
  TranscriptPanel,
} from "./TranscriptBlock";

interface ConvoPresenterProps {
  companionName: string;
  callStatus: CallStatus;
  showTranscript: boolean;
  setShowTranscript: (value: boolean) => void;
  isDesktop: boolean;
  showEndModal: boolean;
  setShowEndModal: (value: boolean) => void;
  userPlan: "free" | "pro" | "king";
  isMuted: boolean;
  isCallInProgress: boolean;
  hasAssistantId: boolean;
  timeLeftDisplay: string;
  loadingMute: boolean;
  loadingStart: boolean;
  loadingEnd: boolean;
  backAction?: ReactNode;
  deleteAction?: ReactNode;
  onStartCall: () => void | Promise<void>;
  onMuteToggle: () => void | Promise<void>;
  onEndCall: () => void | Promise<void>;
  onUpgrade: () => void;
  onDashboard: () => void;
}

function ConvoPresenter({
  companionName,
  callStatus,
  showTranscript,
  setShowTranscript,
  isDesktop,
  showEndModal,
  setShowEndModal,
  userPlan,
  isMuted,
  isCallInProgress,
  hasAssistantId,
  timeLeftDisplay,
  loadingMute,
  loadingStart,
  loadingEnd,
  backAction,
  deleteAction,
  onStartCall,
  onMuteToggle,
  onEndCall,
  onUpgrade,
  onDashboard,
}: ConvoPresenterProps) {
  return (
    <div className="relative flex h-full min-h-0 w-full flex-1 flex-col">
      <motion.main
        variants={motionVariants.fadeUp}
        initial="hidden"
        animate="visible"
        className="relative grid h-full min-h-0 w-full flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)] overflow-hidden text-white md:rounded-3xl md:border md:border-white/10 md:bg-white/5 md:shadow-2xl md:backdrop-blur-xl lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_24rem]"
      >
        <ConvoBlock
          companionName={companionName}
          currentStatus={convoStatusConfig[callStatus]}
          callStatus={callStatus}
          timeLeftDisplay={timeLeftDisplay}
          isCallInProgress={isCallInProgress}
          isMuted={isMuted}
          hasAssistantId={hasAssistantId}
          isDesktop={isDesktop}
          loadingMute={loadingMute}
          loadingStart={loadingStart}
          loadingEnd={loadingEnd}
          backAction={backAction}
          deleteAction={deleteAction}
          setShowTranscript={setShowTranscript}
          onStartCall={onStartCall}
          onMuteToggle={onMuteToggle}
          onEndCall={onEndCall}
        />

        <div className="hidden h-full min-h-0 border-l border-white/10 lg:block">
          <TranscriptPanel companionName={companionName} />
        </div>
      </motion.main>

      <MobileTranscriptOverlay
        showTranscript={showTranscript}
        setShowTranscript={setShowTranscript}
        companionName={companionName}
      />

      <SessionEndedModal
        showEndModal={showEndModal}
        setShowEndModal={setShowEndModal}
        userPlan={userPlan}
        onUpgrade={onUpgrade}
        onDashboard={onDashboard}
      />
    </div>
  );
}

export default memo(ConvoPresenter);
