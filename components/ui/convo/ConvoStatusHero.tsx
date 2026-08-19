"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { memo } from "react";

import { useConvoStore } from "@/store/use-convo-store";

import ConvoLiveTimer from "./ConvoLiveTimer";
import { convoStatusConfig } from "./convo-status-config";
import { useConvoStage } from "./ConvoStageContext";

const GlobeCanvas = dynamic(() => import("../GlobeCanvas"), {
  ssr: false,
});

/** Only mounts/updates when call liveness flips — never on timer ticks. */
function ConvoOrbStage({ isCallLive }: { isCallLive: boolean }) {
  return (
    <div className="mx-auto my-2 w-full max-w-2xl min-h-0 flex-1 overflow-hidden rounded-3xl sm:my-4">
      <div className="relative mx-auto h-[220px] w-full max-h-80 sm:h-80">
        <GlobeCanvas isCallLive={isCallLive} />
      </div>
    </div>
  );
}

const MemoConvoOrbStage = memo(ConvoOrbStage);

function ConvoStatusHero() {
  const { companionName } = useConvoStage();
  const callStatus = useConvoStore((s) => s.callStatus);
  const isCallLive = callStatus === "ACTIVE";
  const currentStatus = convoStatusConfig[callStatus];

  return (
    <div className="flex w-full min-h-0 flex-1 flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg shrink-0 space-y-3 pt-4 pb-2 text-center sm:pt-6"
      >
        <div
          className={`type-meta inline-flex min-w-42 items-center justify-center gap-2 rounded-full border px-3.5 py-1.5 backdrop-blur-md transition-colors ${currentStatus.color}`}
        >
          {currentStatus.icon}
          <span className="tracking-wide">
            {isCallLive ? (
              <>
                Live · <ConvoLiveTimer />
              </>
            ) : (
              currentStatus.label
            )}
          </span>
        </div>

        <h1 className="type-display text-[1.75rem] md:text-[2rem]">
          {companionName || "Your AI Companion"}
        </h1>
      </motion.div>

      <MemoConvoOrbStage isCallLive={isCallLive} />
    </div>
  );
}

export default memo(ConvoStatusHero);
