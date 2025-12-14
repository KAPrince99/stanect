"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import throttle from "lodash.throttle";

import ConvoSkeleton from "./convoSkeleton";
import { getSingleCompanion } from "@/app/(app)/actions/actions";
import { vapiSdk } from "@/lib/vapiSdk";

import { Zap, Radio, X, Headset, Loader2 } from "lucide-react";

import ConvoBlock from "./convoBlock";
import TranscriptBlock from "./TranscriptBlock";

export type CallStatus = "INACTIVE" | "CONNECTING" | "ACTIVE" | "ERROR";

export type Message = {
  role: "assistant" | "user";
  content: string;
};

interface ConvoProps {
  id: string;
}

const statusConfig = {
  CONNECTING: {
    label: "Connecting...",
    icon: <Radio className="w-4 h-4 animate-pulse" />,
    color: "bg-amber-500/20 border-amber-500/50 text-amber-300",
  },
  ACTIVE: {
    label: "Live • Listening",
    icon: <Zap className="w-4 h-4 animate-pulse" />,
    color: "bg-emerald-600/30 border-emerald-500/60 text-emerald-300",
  },
  ERROR: {
    label: "Connection Failed",
    icon: <X className="w-4 h-4" />,
    color: "bg-red-500/30 border-red-500/60 text-red-300",
  },
  INACTIVE: {
    label: "Ready to initiate call",
    icon: <Headset className="w-4 h-4" />,
    color:
      "bg-gradient-to-br from-[#0b1a36] via-[#1a3a80] to-[#1e4ea8] text-white",
  },
};

export default function Convo({ id }: ConvoProps) {
  const [callStatus, setCallStatus] = useState<CallStatus>("INACTIVE");
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const { data: companion, isLoading } = useQuery({
    queryKey: ["companions", id],
    queryFn: async () => getSingleCompanion(id),
  });

  const throttledMessage = useRef(
    throttle((msg: any) => {
      if (
        (msg.type === "transcript" || msg.type === "speech") &&
        msg.transcriptType === "final" &&
        msg.transcript
      ) {
        setMessages((prev) => [
          { role: msg.role, content: msg.transcript },
          ...prev,
        ]);
      }
    }, 200)
  );

  const handleVapiMessage = useCallback((msg: any) => {
    throttledMessage.current(msg);
  }, []);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus("ACTIVE");
      setShowTranscript(true);
    };
    const onCallEnd = () => {
      setCallStatus("INACTIVE");
      setIsMuted(false);
    };
    const onError = (e: any) => {
      console.error("VAPI Error:", e);
      setCallStatus("ERROR");
      setTimeout(() => setCallStatus("INACTIVE"), 5000);
    };

    vapiSdk.on("call-start", onCallStart);
    vapiSdk.on("call-end", onCallEnd);
    vapiSdk.on("error", onError);
    vapiSdk.on("message", handleVapiMessage);

    return () => {
      vapiSdk.off("call-start", onCallStart);
      vapiSdk.off("call-end", onCallEnd);
      vapiSdk.off("error", onError);
      vapiSdk.off("message", handleVapiMessage);
      if (callStatus === "ACTIVE") vapiSdk.stop();
    };
  }, [handleVapiMessage, callStatus]);

  useEffect(() => {
    if (transcriptRef.current) transcriptRef.current.scrollTop = 0;
  }, [messages]);

  const handleCall = async () => {
    if (callStatus !== "INACTIVE" || !companion?.assistant_id) return;
    setMessages([]);
    setCallStatus("CONNECTING");

    try {
      await vapiSdk.start(companion.assistant_id);
    } catch (e) {
      console.error("Failed to start VAPI call:", e);
      setCallStatus("ERROR");
      setTimeout(() => setCallStatus("INACTIVE"), 3000);
    }
  };

  const handleEnd = () => {
    if (callStatus === "ACTIVE" || callStatus === "CONNECTING") {
      vapiSdk.stop();
    }
  };

  const toggleMute = () => {
    if (callStatus === "ACTIVE") {
      vapiSdk.setMuted(!isMuted);
      setIsMuted((prev) => !prev);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center my-50">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!companion)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white p-10">
        <div className="text-center p-8 bg-gray-800 rounded-xl shadow-2xl">
          <X className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-xl font-semibold">Companion not found</p>
        </div>
      </div>
    );

  const currentStatus = statusConfig[callStatus];
  const isCallInProgress =
    callStatus === "ACTIVE" || callStatus === "CONNECTING";
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

  return (
    <div className="flex w-full h-full relative text-white overflow-hidden lg:flex-row flex-col md:border md:border-white/20 md:shadow-2xl md:bg-blue-400/30 md:rounded-2xl">
      {/* Main Conversation Area */}
      <ConvoBlock
        callStatus={callStatus}
        isMuted={isMuted}
        toggleMute={toggleMute}
        handleCall={handleCall}
        handleEnd={handleEnd}
        isCallInProgress={isCallInProgress}
        isDesktop={isDesktop}
        companionName={companion.companion_name || "AI Companion"}
        id={id}
        currentStatus={currentStatus}
        setShowTranscript={setShowTranscript}
      />

      {/* Transcript */}
      <TranscriptBlock
        showTranscript={showTranscript}
        setShowTranscript={setShowTranscript}
        isDesktop={isDesktop}
        transcriptRef={transcriptRef}
        messages={messages}
        companionName={companion.companion_name || "AI Companion"}
      />
    </div>
  );
}
