"use client";

import Image from "next/image";
import { Button } from "./button";
import DeleteCompanionButton from "@/components/ui/deleteCompanionButton";
import { useEffect, useState } from "react";
import { vapiSdk } from "@/lib/vapiSdk";
import { useQuery } from "@tanstack/react-query";
import { getSingleCompanion } from "@/app/(app)/actions/actions";
import ConvoSkeleton from "./convoSkeleton";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

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

export default function Convo({ id }: ConvoProps) {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();

  const { user } = useUser();
  const imageUrl = user?.imageUrl ?? "/avatar-placeholder.png";
  const firstName = user?.firstName ?? "User";

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage: Message = {
          role: message.role,
          content: message.transcript,
        };
        setMessages((prev) => [newMessage, ...prev]);
      }
    };

    const onError = (err: Error) => {
      console.error("Vapi error:", err);
      setCallStatus(CallStatus.INACTIVE);
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    vapiSdk.on("call-start", onCallStart);
    vapiSdk.on("call-end", onCallEnd);
    vapiSdk.on("error", onError);
    vapiSdk.on("message", onMessage);
    vapiSdk.on("speech-start", onSpeechStart);
    vapiSdk.on("speech-end", onSpeechEnd);

    return () => {
      vapiSdk.off("call-start", onCallStart);
      vapiSdk.off("call-end", onCallEnd);
      vapiSdk.off("error", onError);
      vapiSdk.off("message", onMessage);
      vapiSdk.off("speech-start", onSpeechStart);
      vapiSdk.off("speech-end", onSpeechEnd);
    };
  }, []);

  const {
    data: companion,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["companions", id],
    queryFn: () => getSingleCompanion(id),
  });

  const handleCall = async () => {
    if (callStatus !== CallStatus.INACTIVE) return;

    setMessages([]);
    setCallStatus(CallStatus.CONNECTING);

    try {
      await vapiSdk.start(companion.assistant_id, {
        clientMessages: ["transcript"],
        serverMessages: [],
      });
    } catch (err) {
      console.error("Error starting Vapi call:", err);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = () => {
    vapiSdk.stop();
  };

  const toggleMicrophone = () => {
    if (callStatus !== CallStatus.ACTIVE) return;

    const muted = vapiSdk.isMuted();
    vapiSdk.setMuted(!muted);
    setIsMuted(!muted);
  };

  if (isLoading) return <ConvoSkeleton />;
  if (companion?.length === 0) return <div>No data Found</div>;
  if (error) throw new Error(error.message);

  return (
    <div className="flex flex-col md:flex-row h-screen md:h-[80vh] bg-gray-900 text-white w-full rounded-xl overflow-hidden shadow-xl">
      {/* LEFT SIDE */}
      <div className="flex flex-col flex-1  p-4 md:p-8 space-y-4 overflow-y-auto scrollbar-hide">
        {/* HEADER */}
        <div className="flex justify-center items-center pt-2 text-center">
          <div>
            <p className="text-gray-400 text-lg">
              {callStatus === CallStatus.ACTIVE
                ? "Session Active"
                : callStatus === CallStatus.CONNECTING
                ? "Connecting..."
                : callStatus === CallStatus.FINISHED
                ? "Session Ended"
                : "Ready"}
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              {companion?.companion_name}
            </h1>
          </div>
        </div>

        {/* VIDEOS */}
        <div className=" grid grid-cols-1 md:grid-cols-2 md:gap-3 lg:gap-6">
          {/* COMPANION VIDEO / IMAGE */}
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-gray-800">
            <Image
              src={companion.avatars.image_url!}
              alt={`${companion?.companion_name} avatar`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* USER IMAGE */}
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-gray-800 hidden md:block">
            <Image
              src={imageUrl!}
              alt={`${firstName}'s  avatar`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex justify-center items-start">
          <div className="flex justify-between items-start w-full max-w-md gap-6">
            {/* Mic */}
            <Button
              onClick={toggleMicrophone}
              disabled={callStatus !== CallStatus.ACTIVE}
              className="w-16 h-16 rounded-full backdrop-blur-xl bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center"
            >
              {isMuted ? "Mic Off" : "Mic On"}
            </Button>

            {/* End Call */}
            <Button
              onClick={
                callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall
              }
              className={`w-20 h-20 rounded-full text-white flex items-center justify-center font-semibold ${
                callStatus === CallStatus.ACTIVE
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {callStatus === CallStatus.ACTIVE
                ? "End"
                : callStatus === CallStatus.CONNECTING
                ? "..."
                : "Call"}
            </Button>

            {/* More */}
            <Button className="w-16 h-16 rounded-full backdrop-blur-xl bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center">
              More
            </Button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE — TRANSCRIPT */}
      <aside className="w-full md:w-1/3 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto scrollbar-hide hidden md:flex flex-col">
        <div className="flex justify-between items-center pb-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-gray-200">Transcript</h2>
          <DeleteCompanionButton id={companion.id} />
        </div>

        <div className="flex-1 space-y-4 mt-4 text-gray-300">
          {messages.map((m, i) => (
            <p key={i}>
              <span className="font-semibold text-white">
                {m.role === "assistant" ? companion.companion_name : "You"}:
              </span>{" "}
              {m.content}
            </p>
          ))}
        </div>
      </aside>
    </div>
  );
}
