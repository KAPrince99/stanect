"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";

import {
  getSingleCompanion,
  updateUserSeconds,
} from "@/app/(app)/actions/actions";
import { fetchSubscriptionStatus } from "@/app/(app)/actions/subs";
import { vapiSdk } from "@/lib/vapiSdk";

import { Zap, Radio, X } from "lucide-react";

import ConvoBlock from "./convoBlock";
import TranscriptBlock from "./TranscriptBlock";
import LoadingSpinner from "./LoadingSpinner";
import LordIcon from "./lordIcon";
import SessionEndedModal from "./sessionEndedModal";

export type CallStatus = "INACTIVE" | "CONNECTING" | "ACTIVE" | "ERROR";

export type Message = {
  id: string;
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
    icon: (
      <LordIcon
        src="https://cdn.lordicon.com/wjogzler.json"
        trigger="loop"
        colors="primary:#e88c30"
        height={20}
        width={20}
      />
    ),
    color: "bg-white/10 text-white",
  },
};

export default function Convo({ id }: ConvoProps) {
  const { user } = useUser();
  const [callStatus, setCallStatus] = useState<CallStatus>("INACTIVE");
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showEndModal, setShowEndModal] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const sessionStartTimeRef = useRef<number | null>(null);
  const popSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    popSoundRef.current = new Audio("/sounds/bubble-pop.mp3");
    popSoundRef.current.volume = 0.4;
  }, []);

  const playPop = useCallback(() => {
    if (popSoundRef.current) {
      popSoundRef.current.currentTime = 0;
      popSoundRef.current.play().catch(() => {});
    }
  }, []);

  const { data: companion, isLoading: companionLoading } = useQuery({
    queryKey: ["companions", id],
    queryFn: async () => getSingleCompanion(id),
  });

  const { data: subData, isLoading: subLoading } = useQuery({
    queryKey: ["userPlan", user?.id],
    queryFn: () => fetchSubscriptionStatus(user?.id || ""),
    enabled: !!user?.id,
  });

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (callStatus === "ACTIVE") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null) return null;
          if (prev <= 1) {
            stopTimer();
            vapiSdk.stop();
            setShowEndModal(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      stopTimer();
    }
    return () => stopTimer();
  }, [callStatus, stopTimer]);

  const handleMessage = useCallback(
    (msg: any) => {
      if (
        (msg.type === "transcript" || msg.type === "speech") &&
        msg.transcriptType === "final" &&
        msg.transcript
      ) {
        setMessages((prev) => {
          const newContent = msg.transcript.trim();
          const isDuplicate = prev
            .slice(0, 5)
            .some((m) => m.content === newContent && m.role === msg.role);
          if (isDuplicate) return prev;
          playPop();
          return [
            {
              id: msg.id || `${Date.now()}`,
              role: msg.role,
              content: newContent,
            },
            ...prev,
          ];
        });
      }
    },
    [playPop],
  );

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus("ACTIVE");
      setShowTranscript(true);
      sessionStartTimeRef.current = Date.now();
    };

    const onCallEnd = async () => {
      setCallStatus("INACTIVE");
      setIsMuted(false);
      stopTimer();
      if (sessionStartTimeRef.current) {
        const durationSeconds = Math.floor(
          (Date.now() - sessionStartTimeRef.current) / 1000,
        );
        if (durationSeconds > 0) await updateUserSeconds(durationSeconds);
        sessionStartTimeRef.current = null;
      }
    };

    vapiSdk.on("call-start", onCallStart);
    vapiSdk.on("call-end", onCallEnd);
    vapiSdk.on("message", handleMessage);
    vapiSdk.on("error", () => setCallStatus("ERROR"));

    return () => {
      vapiSdk.off("call-start", onCallStart);
      vapiSdk.off("call-end", onCallEnd);
      vapiSdk.off("message", handleMessage);
    };
  }, [handleMessage, stopTimer]);

  const handleCall = async () => {
    if (callStatus !== "INACTIVE" || !companion?.assistant_id) return;
    const initialSeconds = (companion.duration || 2) * 60;
    setMessages([]);
    setCallStatus("CONNECTING");
    setTimeLeft(initialSeconds);
    try {
      await vapiSdk.start(companion.assistant_id, {
        maxDurationSeconds: initialSeconds,
      });
    } catch (e) {
      setCallStatus("ERROR");
    }
  };

  if (companionLoading || subLoading) return <LoadingSpinner />;
  if (!companion) return null;

  const currentPlan = (subData?.plan as "free" | "pro" | "king") || "free";

  return (
    <main className="flex w-full h-full relative text-white overflow-hidden lg:flex-row flex-col md:backdrop-blur-2xl md:bg-white/10 md:border md:border-white/20 md:rounded-2xl md:shadow-2xl">
      <ConvoBlock
        callStatus={callStatus}
        isMuted={isMuted}
        toggleMute={() => {
          vapiSdk.setMuted(!isMuted);
          setIsMuted(!isMuted);
        }}
        handleCall={handleCall}
        handleEnd={async () => vapiSdk.stop()}
        isCallInProgress={
          callStatus === "ACTIVE" || callStatus === "CONNECTING"
        }
        isDesktop={isDesktop}
        companionName={companion.companion_name || "AI"}
        id={id}
        currentStatus={statusConfig[callStatus]}
        setShowTranscript={setShowTranscript}
        timeLeftDisplay={
          timeLeft !== null
            ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`
            : ""
        }
      />
      <TranscriptBlock
        showTranscript={showTranscript}
        setShowTranscript={setShowTranscript}
        isDesktop={isDesktop}
        transcriptRef={transcriptRef}
        messages={messages}
        companionName={companion.companion_name || "AI"}
      />
      <SessionEndedModal
        showEndModal={showEndModal}
        setShowEndModal={setShowEndModal}
        userPlan={currentPlan}
      />
    </main>
  );
}
