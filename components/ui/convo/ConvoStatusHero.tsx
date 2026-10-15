"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { memo, useEffect, useRef } from "react";

import { useGlobeSlot } from "../GlobeRuntime";

import { subscribeVoiceLevel } from "@/lib/voice-level";
import { useConvoStore, type Speaker } from "@/store/use-convo-store";

import ConvoLiveTimer from "./ConvoLiveTimer";
import { CONVO_GLOBE_SIZE, CONVO_GLOBE_STAGE } from "./convo-layout";
import { convoStatusConfig } from "./convo-status-config";
import { useConvoStage } from "./ConvoStageContext";

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
  role,
}: {
  src: string;
  alt: string;
  side: "left" | "right";
  /** Whose voice this portrait stands for. */
  role: Speaker;
}) {
  // Boolean selector: only re-renders when this portrait starts or stops speaking.
  const speaking = useConvoStore((s) => s.speaker === role);
  const portraitRef = useRef<HTMLDivElement>(null);

  // Loudness goes straight into a CSS variable, never through React state,
  // so a reading ten times a second re-renders nothing.
  useEffect(() => {
    const el = portraitRef.current;
    if (!el) return;

    el.style.setProperty("--voice-level", "0");
    if (!speaking) return;

    return subscribeVoiceLevel(role, (level) => {
      el.style.setProperty("--voice-level", level.toFixed(2));
    });
  }, [speaking, role]);

  return (
    <div
      ref={portraitRef}
      data-speaking={speaking}
      className={`absolute top-1/2 z-10 size-10 -translate-y-1/2 sm:size-16 lg:size-20 ${
        side === "left"
          ? "left-0 sm:left-16 lg:left-2"
          : "right-0 sm:right-[18px]"
      }`}
    >
      {speaking ? (
        <>
          {/* Soft halo that swells with how loud the voice is (see
              --voice-level above). Hidden for reduced motion. */}
          <span
            aria-hidden
            className="speaking-halo pointer-events-none absolute inset-0 rounded-full bg-brand-accent [--halo-gain:0.2] sm:[--halo-gain:0.3] motion-reduce:hidden"
          />
          {/* Two staggered rings that grow outward like bubbles. Reduced
              motion keeps only the static orange border below. */}
          <span
            aria-hidden
            className="animate-speaking-pulse pointer-events-none absolute inset-0 rounded-full border-2 border-brand-accent [--speaking-scale:1.25] sm:[--speaking-scale:1.4] motion-reduce:hidden"
          />
          <span
            aria-hidden
            className="animate-speaking-pulse animation-delay-800 pointer-events-none absolute inset-0 rounded-full border-2 border-brand-accent opacity-0 [--speaking-scale:1.25] sm:[--speaking-scale:1.4] motion-reduce:hidden"
          />
        </>
      ) : null}

      <div
        className={`relative size-full overflow-hidden rounded-full border bg-black/20 shadow-lg ring-2 transition-[border-color,box-shadow] duration-200 ${
          speaking
            ? "border-brand-accent shadow-brand-accent/40 ring-brand-accent/40"
            : "border-white/25 ring-white/10"
        }`}
      >
        <Image src={src} alt={alt} fill sizes="80px" className="object-cover" />
      </div>
    </div>
  );
}

/** Only mounts/updates when call liveness flips — never on timer ticks. */
function ConvoOrbStage({
  companionName,
  companionAvatarUrl,
  userAvatarUrl,
}: {
  companionName: string;
  companionAvatarUrl?: string | null;
  userAvatarUrl?: string | null;
}) {
  const globeSlotRef = useRef<HTMLDivElement>(null);
  useGlobeSlot(globeSlotRef);

  return (
    <div className={CONVO_GLOBE_STAGE}>
      {companionAvatarUrl ? (
        <GlobePortrait
          src={companionAvatarUrl}
          alt={companionName}
          side="left"
          role="assistant"
        />
      ) : null}
      {userAvatarUrl ? (
        <GlobePortrait
          src={userAvatarUrl}
          alt="Your profile picture"
          side="right"
          role="user"
        />
      ) : null}
      <div ref={globeSlotRef} className={CONVO_GLOBE_SIZE} />
    </div>
  );
}

const MemoConvoOrbStage = memo(ConvoOrbStage);

/** Same top lane as scene and Delete: compact pill, not Start Call sized. */
export function ConvoStatusBadge() {
  const callStatus = useConvoStore((s) => s.callStatus);
  const isCallLive = callStatus === "ACTIVE";
  const currentStatus = convoStatusConfig[callStatus];

  return (
    <div
      className={`type-meta inline-flex h-9 min-w-42 items-center justify-center gap-2 rounded-full border px-3.5 backdrop-blur-md transition-colors ${currentStatus.color}`}
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
  );
}

function ConvoStatusHero() {
  const { companionName, companionAvatarUrl, userAvatarUrl } = useConvoStage();

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col items-center">
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg shrink-0 pb-2 text-center"
      >
        <h1 className="type-display text-[1.75rem] md:text-[2rem]">
          {companionName || "Your AI Companion"}
        </h1>
      </motion.div>

      <MemoConvoOrbStage
        companionName={companionName || "Your AI Companion"}
        companionAvatarUrl={companionAvatarUrl}
        userAvatarUrl={userAvatarUrl}
      />
    </div>
  );
}

export default memo(ConvoStatusHero);
