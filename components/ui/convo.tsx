"use client";

import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import {
  getSingleCompanion,
  updateUserSeconds,
} from "@/app/(app)/actions/actions";
import { fetchSubscriptionStatus } from "@/app/(app)/actions/subs";
import { vapiSdk } from "@/lib/vapiSdk";
import { Zap, Radio, X } from "lucide-react";
import { useConvoStore } from "@/store/use-convo-store";
import useSound from "use-sound";

import ConvoBlock from "./convoBlock";
import TranscriptBlock from "./TranscriptBlock";
import LoadingSpinner from "./LoadingSpinner";
import LordIcon from "./lordIcon";
import SessionEndedModal from "./sessionEndedModal";

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

export default function Convo({ id }: { id: string }) {
  const { user } = useUser();
  const [isDesktop, setIsDesktop] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  // UseRef for start time stays, but popSoundRef is removed
  const sessionStartTimeRef = useRef<number | null>(null);

  const {
    callStatus,
    showEndModal,
    setCallStatus,
    addMessage,
    tickTimer,
    setMuted,
    setShowEndModal,
  } = useConvoStore();

  // Initialize sound with interrupt to handle rapid messages
  const [playPop] = useSound("/sounds/bubble-pop.mp3", {
    volume: 0.1,
    interrupt: true,
  });

  useEffect(() => {
    setHasHydrated(true);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { data: companion, isLoading: companionLoading } = useQuery({
    queryKey: ["companions", id],
    queryFn: () => getSingleCompanion(id),
  });

  const { data: subData, isLoading: subLoading } = useQuery({
    queryKey: ["userPlan", user?.id],
    queryFn: () => fetchSubscriptionStatus(user?.id || ""),
    enabled: !!user?.id,
  });

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === "ACTIVE") {
      interval = setInterval(tickTimer, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus, tickTimer]);

  // Vapi Event Sync
  useEffect(() => {
    const onCallStart = () => {
      setCallStatus("ACTIVE");
      setShowTranscript(true);
      sessionStartTimeRef.current = Date.now();
    };

    const onCallEnd = async () => {
      setCallStatus("INACTIVE");
      setMuted(false);
      if (sessionStartTimeRef.current) {
        const durationSeconds = Math.floor(
          (Date.now() - sessionStartTimeRef.current) / 1000,
        );
        if (durationSeconds > 0) await updateUserSeconds(durationSeconds);
        sessionStartTimeRef.current = null;
      }
    };

    const handleVapiMessage = (msg: any) => {
      const wasAdded = addMessage(msg);
      // Play sound only if a new message was successfully added to the store
      if (wasAdded) {
        playPop();
      }
    };

    vapiSdk.on("call-start", onCallStart);
    vapiSdk.on("call-end", onCallEnd);
    vapiSdk.on("message", handleVapiMessage);
    vapiSdk.on("error", () => setCallStatus("ERROR"));

    return () => {
      vapiSdk.off("call-start", onCallStart);
      vapiSdk.off("call-end", onCallEnd);
      vapiSdk.off("message", handleVapiMessage);
    };
    // playPop added to dependency array to ensure the listener uses the latest function reference
  }, [setCallStatus, setMuted, addMessage, playPop]);

  if (!hasHydrated || companionLoading || subLoading) return <LoadingSpinner />;
  if (!companion) return null;

  return (
    <main className="flex w-full h-full relative text-white overflow-hidden lg:flex-row flex-col md:backdrop-blur-2xl md:bg-white/10 md:border md:border-white/20 md:rounded-2xl md:shadow-2xl">
      <ConvoBlock
        companionName={companion.companion_name || "AI"}
        id={id}
        currentStatus={statusConfig[callStatus]}
        setShowTranscript={setShowTranscript}
        isDesktop={isDesktop}
      />
      <TranscriptBlock
        showTranscript={showTranscript}
        setShowTranscript={setShowTranscript}
        isDesktop={isDesktop}
        companionName={companion.companion_name || "AI"}
      />
      <SessionEndedModal
        showEndModal={showEndModal}
        setShowEndModal={setShowEndModal}
        userPlan={(subData?.plan as any) || "free"}
      />
    </main>
  );
}
