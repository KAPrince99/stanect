"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { memo } from "react";

import { CallStatus } from "@/store/use-convo-store";

import { ConvoStatusView } from "./convo-status-config";

const GlobeCanvas = dynamic(() => import("../GlobeCanvas"), {
  ssr: false,
});

interface ConvoStatusHeroProps {
  companionName: string;
  callStatus: CallStatus;
  currentStatus: ConvoStatusView;
  timeLeftDisplay: string;
  isCallInProgress: boolean;
}

function ConvoStatusHero({
  companionName,
  callStatus,
  currentStatus,
  timeLeftDisplay,
  isCallInProgress,
}: ConvoStatusHeroProps) {
  const statusLabel =
    callStatus === "ACTIVE" && timeLeftDisplay
      ? `Live · ${timeLeftDisplay}`
      : currentStatus.label;

  return (
    <div className="flex w-full min-h-0 flex-1 flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg shrink-0 space-y-3 pt-4 pb-2 text-center sm:pt-6"
      >
        <div
          className={`type-meta inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 backdrop-blur-md transition-colors ${currentStatus.color}`}
        >
          {currentStatus.icon}
          <span className="tracking-wide">{statusLabel}</span>
        </div>

        <h1 className="type-display text-[1.75rem] md:text-[2rem]">
          {companionName || "Your AI Companion"}
        </h1>
      </motion.div>

      <div className="mx-auto my-2 w-full max-w-2xl min-h-0 flex-1 overflow-hidden rounded-3xl sm:my-4">
        <div className="relative mx-auto h-full max-h-80 min-h-[220px] w-full">
          <GlobeCanvas
            isCallInProgress={isCallInProgress}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(ConvoStatusHero);
