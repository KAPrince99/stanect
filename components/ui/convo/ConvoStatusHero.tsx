"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { memo } from "react";

import { useConvoStore } from "@/store/use-convo-store";

import ConvoLiveTimer from "./ConvoLiveTimer";
import { convoStatusConfig } from "./convo-status-config";
import { useConvoStage } from "./ConvoStageContext";

const GlobeCanvas = dynamic(() => import("../GlobeCanvas"), {
  ssr: false,
});

/**
 * Round portrait pinned to the far left or far right edge of the call area,
 * centered on the globe's vertical middle. The camera looks straight at the
 * sphere's center, so the middle of the stage row is the middle of the globe.
 * Horizontally they line up with the corner row in ConvoPresenter. This row
 * sits inside the call area's 0.5rem padding, so every offset below is the
 * corner row's offset minus 0.5rem:
 * - left edge = the scene's left edge (lg: 1rem, sm–lg: 4.5rem after the back button)
 * - right edge = Delete's visible edge (sm+: 1rem inset + 0.625rem button padding)
 * On phones there is no room beside the globe, so they stay at the edges.
 */
function GlobePortrait({
  src,
  alt,
  side,
}: {
  src: string;
  alt: string;
  side: "left" | "right";
}) {
  return (
    <div
      className={`absolute top-1/2 z-10 size-10 -translate-y-1/2 overflow-hidden rounded-full border border-white/25 bg-black/20 shadow-lg ring-2 ring-white/10 sm:size-16 lg:size-20 ${
        side === "left"
          ? "left-0 sm:left-16 lg:left-2"
          : "right-0 sm:right-[18px]"
      }`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="80px"
        className="object-cover"
      />
    </div>
  );
}

/** Only mounts/updates when call liveness flips — never on timer ticks. */
function ConvoOrbStage({
  isCallLive,
  companionName,
  companionAvatarUrl,
  userAvatarUrl,
}: {
  isCallLive: boolean;
  companionName: string;
  companionAvatarUrl?: string | null;
  userAvatarUrl?: string | null;
}) {
  return (
    <div className="relative mx-auto my-2 flex w-full items-center justify-center sm:my-4 lg:mb-10">
      {companionAvatarUrl ? (
        <GlobePortrait
          src={companionAvatarUrl}
          alt={companionName}
          side="left"
        />
      ) : null}
      {userAvatarUrl ? (
        <GlobePortrait
          src={userAvatarUrl}
          alt="Your profile picture"
          side="right"
        />
      ) : null}
      <div className="relative aspect-square w-[220px] sm:w-72 xl:w-[23rem] 2xl:w-[26rem]">
        <GlobeCanvas isCallLive={isCallLive} />
      </div>
    </div>
  );
}

const MemoConvoOrbStage = memo(ConvoOrbStage);

function ConvoStatusHero() {
  const { companionName, companionAvatarUrl, userAvatarUrl } = useConvoStage();
  const callStatus = useConvoStore((s) => s.callStatus);
  const isCallLive = callStatus === "ACTIVE";
  const currentStatus = convoStatusConfig[callStatus];

  return (
    <div className="flex w-full min-h-0 flex-col items-center">
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

      <MemoConvoOrbStage
        isCallLive={isCallLive}
        companionName={companionName || "Your AI Companion"}
        companionAvatarUrl={companionAvatarUrl}
        userAvatarUrl={userAvatarUrl}
      />
    </div>
  );
}

export default memo(ConvoStatusHero);
