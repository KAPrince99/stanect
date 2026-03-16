"use client";

import { useEffect, useState, useRef, memo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import {
  getSingleCompanion,
  updateUserSeconds,
} from "@/app/(app)/actions/actions";
import { fetchSubscriptionStatus } from "@/app/(app)/actions/subs";
import { getVapiSdk } from "@/lib/vapiSdk";
import { Zap, Radio, X } from "lucide-react";
import { useConvoStore } from "@/store/use-convo-store";
import useSound from "use-sound";
import throttle from "lodash.throttle";

import ConvoBlock from "./convoBlock";
import TranscriptBlock from "./TranscriptBlock";
import LoadingSpinner from "../LoadingSpinner";
import LordIcon from "../lordIcon";
import SessionEndedModal from "./sessionEndedModal";
import { isCallOwner } from "@/lib/tabCallLock";
import { motion } from "framer-motion";
import { motionVariants } from "@/lib/motion";

const statusConfig = {
  CONNECTING: {
    label: "Connecting...",
    icon: <Radio className="w-4 h-4 animate-pulse" />,
    color: "bg-amber-500/15 border-amber-400/40 text-amber-200",
  },
  ACTIVE: {
    label: "Live • Listening",
    icon: <Zap className="w-4 h-4 animate-pulse" />,
    color: "bg-emerald-500/15 border-emerald-400/40 text-emerald-200",
  },
  ERROR: {
    label: "Connection Failed",
    icon: <X className="w-4 h-4" />,
    color: "bg-red-500/15 border-red-400/40 text-red-200",
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
    color: "bg-white/5 border-white/20 text-white/85",
  },
};

function Convo({ id }: { id: string }) {
  const { user } = useUser();
  const [isDesktop, setIsDesktop] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  const sessionStartTimeRef = useRef<number | null>(null);

  const vapiRef = useRef<any>(null);

  const {
    callStatus,
    showEndModal,
    setCallStatus,
    addMessage,
    tickTimer,
    setMuted,
    setShowEndModal,
  } = useConvoStore();

  const [playSound] = useSound("/sounds/bubble-pop.mp3", {
    volume: 0.1,
    interrupt: true,
  });

  const playPop = useCallback(
    throttle(() => playSound(), 300),
    [playSound],
  );

  useEffect(() => {
    const handler = () => {
      if (!isCallOwner()) {
        useConvoStore.setState({ callStatus: "INACTIVE" });
      }
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

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
    staleTime: Infinity,
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

  // Lazy-loaded Vapi event sync
  useEffect(() => {
    let vapi: any;

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

        if (durationSeconds > 0) {
          await updateUserSeconds(durationSeconds);
        }

        sessionStartTimeRef.current = null;
      }
    };

    const handleVapiMessage = (msg: any) => {
      const wasAdded = addMessage(msg);
      if (wasAdded) playPop();
    };

    const setup = async () => {
      const vapi = await getVapiSdk();
      vapiRef.current = vapi;

      vapi.on("call-start", onCallStart);
      vapi.on("call-end", onCallEnd);
      vapi.on("message", handleVapiMessage);
      vapi.on("error", () => setCallStatus("ERROR"));
    };

    setup();

    return () => {
      const vapi = vapiRef.current;
      if (!vapi) return;

      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", handleVapiMessage);
    };
  }, [addMessage, playPop, setCallStatus, setMuted]);

  if (!hasHydrated || companionLoading || subLoading) return <LoadingSpinner />;
  if (!companion) return null;

  return (
    <motion.main
      variants={motionVariants.fadeUp}
      initial="hidden"
      animate="visible"
      className="flex w-full h-full relative text-white overflow-hidden lg:flex-row flex-col md:backdrop-blur-xl md:bg-white/5 md:border md:border-white/10 md:rounded-2xl md:shadow-2xl"
    >
      <ConvoBlock
        companion={companion}
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
    </motion.main>
  );
}

export default memo(Convo);
