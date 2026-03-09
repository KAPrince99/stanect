"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteCompanionButton from "@/components/ui/deleteCompanionButton";
import TranscriptToggle from "../TranscriptToggle";
import LordIcon from "../lordIcon";
import { useConvoStore } from "@/store/use-convo-store";
import { memo, useState } from "react";
import { CompanionProps } from "@/types/types";
import dynamic from "next/dynamic";
import { getVapiSdk } from "@/lib/vapiSdk";

const GlobeCanvas = dynamic(() => import("../GlobeCanvas"), {
  ssr: false,
});

interface Props {
  isDesktop: boolean;
  companion: CompanionProps;
  id: string;
  currentStatus: { label: string; icon: JSX.Element; color: string };
  setShowTranscript: (value: boolean) => void;
}

function ConvoBlock({
  isDesktop,
  companion,
  id,
  currentStatus,
  setShowTranscript,
}: Props) {
  const { callStatus, isMuted, setMuted, timeLeft, startCall, endCall } =
    useConvoStore();

  const [loadingMute, setLoadingMute] = useState(false);
  const [loadingStart, setLoadingStart] = useState(false);
  const [loadingEnd, setLoadingEnd] = useState(false);

  const isCallInProgress =
    callStatus === "ACTIVE" || callStatus === "CONNECTING";

  const timeLeftDisplay =
    timeLeft !== null
      ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60)
          .toString()
          .padStart(2, "0")}`
      : "";

  // Async-safe mute toggle
  const handleMuteToggle = async () => {
    if (!isCallInProgress) return;
    setLoadingMute(true);
    try {
      const vapi = await getVapiSdk();
      await vapi.setMuted(!isMuted);
      setMuted(!isMuted);
    } catch (err) {
      console.error("Failed to toggle mute:", err);
    } finally {
      setLoadingMute(false);
    }
  };

  // Async-safe start call
  const handleStartCall = async () => {
    if (!companion.assistant_id || isCallInProgress) return;
    setLoadingStart(true);
    try {
      await startCall(companion.assistant_id, Number(companion.duration) || 2);
    } finally {
      setLoadingStart(false);
    }
  };

  // Async-safe end call
  const handleEndCall = async () => {
    if (!isCallInProgress) return;
    setLoadingEnd(true);
    try {
      await endCall();
    } finally {
      setLoadingEnd(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-between relative z-10 h-full px-2 gap-y-15 md:gap-y-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 pt-2 pb-4 max-w-lg w-full shrink-0"
      >
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 backdrop-blur-md text-sm font-medium transition-colors ${currentStatus.color}`}
        >
          {currentStatus.icon}
          <span className="uppercase tracking-wider">
            {currentStatus.label}
            {callStatus === "ACTIVE" && ` • ${timeLeftDisplay}`}
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent tracking-tighter">
          {companion.companion_name || "Your AI Companion"}
        </h1>
      </motion.div>

      <div
        className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden my-4"
        style={{ height: "300px" }}
      >
        <GlobeCanvas
          callStatus={callStatus}
          isCallInProgress={isCallInProgress}
        />
      </div>

      <div className="flex justify-center items-center gap-6 py-8 z-20 shrink-0">
        <DeleteCompanionButton id={id} />

        {!isCallInProgress ? (
          <Button
            className="px-8 py-3 text-lg font-bold bg-green-500 hover:bg-[#e88c30] transition-colors flex items-center shadow-lg shadow-indigo-600/50 cursor-pointer"
            onClick={handleStartCall}
            disabled={loadingStart || !companion.assistant_id}
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
              className={`w-14 h-14 p-0 rounded-full backdrop-blur-lg transition-colors border-2 border-white/20 shadow-xl cursor-pointer ${
                isMuted
                  ? "bg-red-500/30 hover:bg-red-500/50"
                  : "bg-emerald-500/30 hover:bg-emerald-500/50"
              }`}
              onClick={handleMuteToggle}
              disabled={loadingMute}
            >
              {isMuted ? (
                <MicOff className="w-6 h-6 text-red-400" />
              ) : (
                <Mic className="w-6 h-6 text-emerald-400" />
              )}
            </Button>

            <Button
              className="w-16 h-16 p-0 rounded-full bg-red-600 hover:bg-red-700 transition-colors shadow-2xl shadow-red-600/50 cursor-pointer"
              onClick={handleEndCall}
              disabled={loadingEnd}
            >
              <PhoneOff className="w-7 h-7 text-white" />
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
    </div>
  );
}

export default memo(ConvoBlock);
