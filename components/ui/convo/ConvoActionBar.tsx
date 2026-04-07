"use client";

import { AnimatePresence } from "framer-motion";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { memo } from "react";

import { Button } from "@/components/ui/button";
import DeleteCompanionButton from "@/components/ui/deleteCompanionButton";

import LordIcon from "../lordIcon";
import TranscriptToggle from "../TranscriptToggle";

interface ConvoActionBarProps {
  companionId: string;
  isDesktop: boolean;
  isCallInProgress: boolean;
  isMuted: boolean;
  hasAssistantId: boolean;
  loadingMute: boolean;
  loadingStart: boolean;
  loadingEnd: boolean;
  setShowTranscript: (value: boolean) => void;
  onStartCall: () => void | Promise<void>;
  onMuteToggle: () => void | Promise<void>;
  onEndCall: () => void | Promise<void>;
}

function ConvoActionBar({
  companionId,
  isDesktop,
  isCallInProgress,
  isMuted,
  hasAssistantId,
  loadingMute,
  loadingStart,
  loadingEnd,
  setShowTranscript,
  onStartCall,
  onMuteToggle,
  onEndCall,
}: ConvoActionBarProps) {
  return (
    <div className="z-20 flex shrink-0 items-center justify-center gap-6 py-8">
      <DeleteCompanionButton id={companionId} />

      {!isCallInProgress ? (
        <Button
          className="flex items-center bg-green-500 px-8 py-3 text-lg font-bold shadow-lg shadow-indigo-600/50 transition-colors hover:bg-[#e88c30] cursor-pointer"
          onClick={onStartCall}
          disabled={loadingStart || !hasAssistantId}
        >
          <LordIcon
            src="https://cdn.lordicon.com/wtywrnoz.json"
            trigger="loop"
            colors="primary:#ffffff"
            height={20}
            width={20}
          />
          {loadingStart ? "Starting..." : "Start Call"}
        </Button>
      ) : (
        <div className="flex items-center gap-4">
          <Button
            className={`h-14 w-14 rounded-full border-2 border-white/20 p-0 shadow-xl backdrop-blur-lg transition-colors cursor-pointer ${
              isMuted
                ? "bg-red-500/30 hover:bg-red-500/50"
                : "bg-emerald-500/30 hover:bg-emerald-500/50"
            }`}
            onClick={onMuteToggle}
            disabled={loadingMute}
          >
            {isMuted ? (
              <MicOff className="h-6 w-6 text-red-400" />
            ) : (
              <Mic className="h-6 w-6 text-emerald-400" />
            )}
          </Button>

          <Button
            className="h-16 w-16 rounded-full bg-red-600 p-0 shadow-2xl shadow-red-600/50 transition-colors hover:bg-red-700 cursor-pointer"
            onClick={onEndCall}
            disabled={loadingEnd}
          >
            <PhoneOff className="h-7 w-7 text-white" />
          </Button>
        </div>
      )}

      {!isDesktop && (
        <AnimatePresence>
          {!isCallInProgress && (
            <TranscriptToggle setShowTranscript={setShowTranscript} />
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export default memo(ConvoActionBar);
