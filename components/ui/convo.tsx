"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import DeleteCompanionButton from "@/components/ui/deleteCompanionButton";
import { useEffect, useState, useRef, useCallback } from "react";
import { vapiSdk } from "@/lib/vapiSdk";
import { useQuery } from "@tanstack/react-query";
import { getSingleCompanion } from "@/app/(app)/actions/actions";
import ConvoSkeleton from "./convoSkeleton";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  MoreVertical,
  Zap,
  Radio,
  CheckCircle2,
  Delete,
  Trash2,
} from "lucide-react";
import throttle from "lodash.throttle";

interface ConvoProps {
  id: string;
}

type Message = {
  role: "assistant" | "user";
  content: string;
};

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

const statusConfig = {
  [CallStatus.CONNECTING]: {
    label: "Connecting to her...",
    icon: <Radio className="w-4 h-4 animate-pulse" />,
    color: "bg-amber-500/20 border-amber-500/50 text-amber-300",
  },
  [CallStatus.ACTIVE]: {
    label: "Live • She can hear you",
    icon: <Zap className="w-4 h-4" />,
    color: "bg-emerald-500/20 border-emerald-500/50 text-emerald-300",
  },
  [CallStatus.FINISHED]: {
    label: "Session ended",
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: "bg-gray-500/20 border-gray-500/50 text-gray-400",
  },
  default: {
    label: "Ready when you are",
    icon: null,
    color: "bg-blue-500/20 border-blue-500/40 text-blue-300",
  },
};

export default function Convo({ id }: ConvoProps) {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const { user } = useUser();
  const imageUrl = user?.imageUrl ?? "/avatar-placeholder.png";
  const firstName = user?.firstName ?? "You";

  const { data: companion, isLoading } = useQuery({
    queryKey: ["companions", id],
    queryFn: async () => getSingleCompanion(id),
  });

  // --- Throttled message handler ---
  const throttledMessage = useRef(
    throttle((msg: any) => {
      if (msg.type === "transcript" && msg.transcriptType === "final") {
        setMessages((prev) => [
          { role: msg.role, content: msg.transcript },
          ...prev,
        ]);
      }
    }, 100)
  );

  const handleVapiMessage = useCallback((msg: any) => {
    throttledMessage.current(msg);
  }, []);

  // --- VAPI Event Listeners ---
  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
    const onError = () => setCallStatus(CallStatus.INACTIVE);
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    vapiSdk.on("call-start", onCallStart);
    vapiSdk.on("call-end", onCallEnd);
    vapiSdk.on("error", onError);
    vapiSdk.on("speech-start", onSpeechStart);
    vapiSdk.on("speech-end", onSpeechEnd);
    vapiSdk.on("message", handleVapiMessage);

    return () => {
      vapiSdk.off("call-start", onCallStart);
      vapiSdk.off("call-end", onCallEnd);
      vapiSdk.off("error", onError);
      vapiSdk.off("speech-start", onSpeechStart);
      vapiSdk.off("speech-end", onSpeechEnd);
      vapiSdk.off("message", handleVapiMessage);
    };
  }, [handleVapiMessage]);

  // --- Auto-scroll newest messages to top ---
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = 0;
    }
  }, [messages]);

  const handleCall = async () => {
    if (!companion?.assistant_id || callStatus !== CallStatus.INACTIVE) return;
    setMessages([]);
    setCallStatus(CallStatus.CONNECTING);
    try {
      await vapiSdk.start(companion.assistant_id);
    } catch (err) {
      console.error(err);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleEnd = () => vapiSdk.stop();

  const toggleMute = () => {
    vapiSdk.setMuted(!isMuted);
    setIsMuted(!isMuted);
  };

  if (isLoading) return <ConvoSkeleton />;
  if (!companion)
    return (
      <div className="text-white text-center p-10">Companion not found</div>
    );

  const currentStatus = statusConfig[callStatus] || statusConfig.default;

  return (
    <div className="flex flex-col md:flex-row h-screen md:h-[88vh] bg-gradient-to-br from-[#0b1a36] via-[#1a3a80] to-[#1e4ea8] text-white w-full rounded-2xl overflow-hidden shadow-2xl mt-10">
      {/* MAIN CALL AREA */}
      <div className="flex-1 flex flex-col p-6 md:p-10">
        {/* Header */}
        <div className="flex flex-col items-center gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              layout
              className={`relative flex items-center gap-3 px-6 py-3 rounded-full border backdrop-blur-xl font-medium text-sm tracking-wider ${currentStatus.color}`}
            >
              {currentStatus.icon}
              <span>{currentStatus.label}</span>
              {callStatus === CallStatus.ACTIVE && (
                <div className="absolute -top-1 -right-1">
                  <div className="w-4 h-4 bg-emerald-400 rounded-full animate-ping" />
                  <div className="absolute inset-0 w-4 h-4 bg-emerald-400 rounded-full" />
                </div>
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mt-6 text-5xl md:text-6xl lg:text-7xl font-display tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent"
            >
              {companion.companion_name}
            </motion.h1>

            {callStatus === CallStatus.ACTIVE && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white/60 text-lg mt-2 font-inter"
              >
                Say something... she’s listening
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Avatars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto flex-1">
          <div className="relative aspect-square rounded-3xl overflow-hidden ring-4 ring-white/20 shadow-2xl">
            <Image
              src={companion.avatars.image_url || "/avatars/avatar_0.jpg"}
              alt={companion.companion_name}
              fill
              className="object-cover"
            />
            {isSpeaking && (
              <div className="absolute inset-0 ring-8 ring-emerald-400/60 animate-pulse" />
            )}
          </div>

          <div className="relative aspect-square rounded-3xl overflow-hidden ring-4 ring-white/10 shadow-2xl hidden md:block">
            <Image
              src={imageUrl}
              alt={firstName}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-4 py-1.5 rounded-full text-sm font-medium">
              You
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-10 mt-12">
          <Button
            size="icon"
            variant="outline"
            onClick={toggleMute}
            disabled={callStatus !== CallStatus.ACTIVE}
            className="w-16 h-16 rounded-full border-white/30 bg-white/10 backdrop-blur hover:bg-white/20 cursor-pointer"
          >
            {isMuted ? (
              <MicOff className="w-7 h-7" />
            ) : (
              <Mic className="w-7 h-7" />
            )}
          </Button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={callStatus === CallStatus.ACTIVE ? handleEnd : handleCall}
            disabled={callStatus === CallStatus.CONNECTING}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-2xl transition-all cursor-pointer ${
              callStatus === CallStatus.ACTIVE
                ? "bg-red-600 hover:bg-red-700 shadow-red-600/60"
                : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-500/60"
            }`}
          >
            {callStatus === CallStatus.ACTIVE ? (
              <PhoneOff className="w-11 h-11" />
            ) : callStatus === CallStatus.CONNECTING ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              >
                <Phone className="w-11 h-11 " />
              </motion.div>
            ) : (
              <Phone className="w-11 h-11 " />
            )}
          </motion.button>

          <DeleteCompanionButton id={companion.id} />
        </div>
      </div>

      {/* TRANSCRIPT SIDEBAR */}
      <aside className="hidden md:flex flex-col w-full md:w-96 bg-white/5 backdrop-blur-xl border-l border-white/10">
        <div className="p-6 border-b border-white/10 flex justify-start items-center">
          <h2 className="text-xl font-bold">Conversation</h2>
        </div>
        <div
          ref={transcriptRef}
          className="flex-1 p-6 space-y-6 overflow-y-auto scrollbar-hide"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-5 py-3.5 rounded-3xl shadow-lg border ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400/50"
                      : "bg-white/10 backdrop-blur-md border-white/20 text-white/95"
                  }`}
                >
                  <p className="text-xs font-semibold opacity-80">
                    {msg.role === "assistant"
                      ? companion.companion_name
                      : "You"}
                  </p>
                  <p className="mt-1.5 text-base leading-relaxed">
                    {msg.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="px-5 py-3.5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
                <div className="flex gap-1.5">
                  <span
                    className="w-2 h-2 bg-white/70 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-white/70 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-white/70 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </aside>
    </div>
  );
}
