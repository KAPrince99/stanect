"use client";

import { AnimatePresence } from "framer-motion";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { memo } from "react";

import { Button } from "@/components/ui/button";
import { useConvoStore } from "@/store/use-convo-store";

import LordIcon from "../lordIcon";
import TranscriptToggle from "../TranscriptToggle";
import { useConvoStage } from "./ConvoStageContext";
import { lordColors } from "@/lib/brand";

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
          variant="success"
          size="md"
          // Same size as Continue / Create companion on the dashboard.
          className="sm:w-48 sm:gap-2 sm:px-4 sm:has-[>svg]:px-4"
          onClick={onStartCall}
          disabled={showStarting || !hasAssistantId}
        >
          <LordIcon
            src="https://cdn.lordicon.com/wtywrnoz.json"
            trigger="loop"
            colors={lordColors({ primary: "black" })}
            height={20}
            width={20}
          />
          {showStarting ? "Starting…" : "Start Call"}
        </Button>
      ) : (
        <div className="flex items-center gap-4">
          <Button
            variant="glass"
            size="icon"
            className={`size-14 border-2 border-white/20 shadow-xl backdrop-blur-lg ${
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
            variant="danger"
            size="icon"
            className="size-16 shadow-2xl shadow-red-600/50"
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
