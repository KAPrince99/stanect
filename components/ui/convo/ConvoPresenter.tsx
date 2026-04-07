"use client";

import { motion } from "framer-motion";
import { memo } from "react";

import { motionVariants } from "@/lib/motion";
import { CallStatus } from "@/store/use-convo-store";
import { CompanionProps } from "@/types/types";

import { convoStatusConfig } from "./convo-status-config";
import ConvoBlock from "./convoBlock";
import SessionEndedModal from "./sessionEndedModal";
import TranscriptBlock from "./TranscriptBlock";

interface ConvoPresenterProps {
  companion: CompanionProps;
  id: string;
  callStatus: CallStatus;
  showTranscript: boolean;
  setShowTranscript: (value: boolean) => void;
  isDesktop: boolean;
  showEndModal: boolean;
  setShowEndModal: (value: boolean) => void;
  userPlan: "free" | "pro" | "king";
}

function ConvoPresenter({
  companion,
  id,
  callStatus,
  showTranscript,
  setShowTranscript,
  isDesktop,
  showEndModal,
  setShowEndModal,
  userPlan,
}: ConvoPresenterProps) {
  return (
    <motion.main
      variants={motionVariants.fadeUp}
      initial="hidden"
      animate="visible"
      className="relative flex h-full w-full overflow-hidden text-white md:rounded-2xl md:border md:border-white/10 md:bg-white/5 md:shadow-2xl md:backdrop-blur-xl lg:flex-row flex-col"
    >
      <ConvoBlock
        companion={companion}
        id={id}
        currentStatus={convoStatusConfig[callStatus]}
        setShowTranscript={setShowTranscript}
        isDesktop={isDesktop}
      />

      <TranscriptBlock
        showTranscript={showTranscript}
        setShowTranscript={setShowTranscript}
        isDesktop={isDesktop}
        companionName={companion.companion_name || "AI"}
      />

      <SessionEndedModal
        showEndModal={showEndModal}
        setShowEndModal={setShowEndModal}
        userPlan={userPlan}
      />
    </motion.main>
  );
}

export default memo(ConvoPresenter);
