"use client";

import { AnimatePresence } from "framer-motion";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { memo } from "react";

import { Button } from "@/components/ui/button";
import { useConvoStore } from "@/store/use-convo-store";

import LordIcon from "../lordIcon";
import TranscriptToggle from "../TranscriptToggle";
import { useConvoStage } from "./ConvoStageContext";

function ConvoActionBar() {
  const {
    isDesktop,
    hasAssistantId,
    loadingMute,
    loadingStart,
    loadingEnd,
    onStartCall,
    onMuteToggle,
    onEndCall,
  } = useConvoStage();
  const callStatus = useConvoStore((s) => s.callStatus);
  const isMuted = useConvoStore((s) => s.isMuted);
  const isCallLive = callStatus === "ACTIVE";
  const isStarting = callStatus === "CONNECTING";
  const showStarting = loadingStart || isStarting;

  return (
    <div className="z-20 flex shrink-0 items-center justify-center gap-4 py-6 sm:gap-6 sm:py-8">
      {!isCallLive ? (
        <Button
          className="type-cta h-12 cursor-pointer rounded-full bg-linear-to-r from-amber-400 to-orange-500 px-8 text-black shadow-lg shadow-amber-500/25 transition hover:scale-[1.02] hover:shadow-amber-500/40 disabled:opacity-60"
          onClick={onStartCall}
          disabled={showStarting || !hasAssistantId}
        >
          <LordIcon
            src="https://cdn.lordicon.com/wtywrnoz.json"
            trigger="loop"
            colors="primary:#000000"
            height={20}
            width={20}
          />
          {showStarting ? "Starting…" : "Start Call"}
        </Button>
      ) : (
        <div className="flex items-center gap-4">
          <Button
            className={`h-14 w-14 cursor-pointer rounded-full border-2 border-white/20 p-0 shadow-xl backdrop-blur-lg transition-colors ${
              isMuted
                ? "bg-red-500/30 hover:bg-red-500/50"
                : "bg-emerald-500/30 hover:bg-emerald-500/50"
            }`}
            onClick={onMuteToggle}
            disabled={loadingMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <MicOff className="h-6 w-6 text-red-400" />
            ) : (
              <Mic className="h-6 w-6 text-emerald-400" />
            )}
          </Button>

          <Button
            className="h-16 w-16 cursor-pointer rounded-full bg-red-600 p-0 shadow-2xl shadow-red-600/50 transition-colors hover:bg-red-700"
            onClick={onEndCall}
            disabled={loadingEnd}
            aria-label="End call"
          >
            <PhoneOff className="h-7 w-7 text-white" />
          </Button>
        </div>
      )}

      {!isDesktop && (
        <AnimatePresence>
          {!isCallLive && !showStarting && (
            <TranscriptToggle />
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export default memo(ConvoActionBar);
