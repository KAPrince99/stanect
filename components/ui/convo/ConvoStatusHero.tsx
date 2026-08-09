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
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg shrink-0 space-y-4 pt-2 pb-4 text-center"
      >
        <div
          className={`type-meta inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 backdrop-blur-md transition-colors ${currentStatus.color}`}
        >
          {currentStatus.icon}
          <span className="tracking-wider uppercase">
            {currentStatus.label}
            {callStatus === "ACTIVE" && ` • ${timeLeftDisplay}`}
          </span>
        </div>

        <h1 className="type-display text-[1.75rem] md:text-[2rem]">
          {companionName || "Your AI Companion"}
        </h1>
      </motion.div>

      <div
        className="my-4 mx-auto w-full max-w-2xl overflow-hidden rounded-3xl"
        style={{ height: "300px" }}
      >
        <GlobeCanvas
          callStatus={callStatus}
          isCallInProgress={isCallInProgress}
        />
      </div>
    </>
  );
}

export default memo(ConvoStatusHero);
