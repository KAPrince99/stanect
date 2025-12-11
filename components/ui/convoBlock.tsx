"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteCompanionButton from "@/components/ui/deleteCompanionButton";
import { Globe } from "./Globe";
import TranscriptToggle from "./TranscriptToggle";
import { CallStatus } from "./convo";

interface Props {
  callStatus: CallStatus;
  isMuted: boolean;
  toggleMute: () => void;
  handleCall: () => void;
  handleEnd: () => void;
  isCallInProgress: boolean;
  isDesktop: boolean;
  companionName: string;
  id: string;
  currentStatus: {
    label: string;
    icon: JSX.Element;
    color: string;
  };
  setShowTranscript: (value: boolean) => void;
}

export default function ConvoBlock({
  callStatus,
  isMuted,
  toggleMute,
  handleCall,
  handleEnd,
  isCallInProgress,
  isDesktop,
  companionName,
  id,
  currentStatus,
  setShowTranscript,
}: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-between relative z-10 overflow-y-auto h-full px-2 gap-y-6 md:gap-y-0">
      {/* Status and Companion Name */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 pt-2 pb-4 max-w-lg w-full shrink-0"
      >
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 backdrop-blur-md text-sm font-medium transition-colors ${currentStatus.color}`}
        >
          {currentStatus.icon}{" "}
          <span className="uppercase tracking-wider">
            {currentStatus.label}
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent tracking-tighter">
          {companionName}
        </h1>

        {/* {callStatus === "ACTIVE" && (
          <p className="text-white/70 text-base md:text-lg animate-pulse-slow">
            Speak now... she is processing your voice input.
          </p>
        )} */}
      </motion.div>

      {/* Globe 3D Canvas */}
      <div
        className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden my-4"
        style={{ height: "300px" }}
      >
        <Canvas camera={{ position: [8, 8, 8], fov: 50 }} className="h-full">
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} />
          <Globe isActive={callStatus === "ACTIVE"} />
          <OrbitControls
            enableZoom={false}
            autoRotate={!isCallInProgress}
            autoRotateSpeed={0.5}
            enableDamping
            dampingFactor={0.1}
          />
        </Canvas>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center items-center gap-6 py-8 z-20 shrink-0">
        <DeleteCompanionButton id={id} />

        {!isCallInProgress ? (
          <Button
            className="px-8 py-3 text-xl font-bold rounded-full bg-green-500 hover:bg-amber-700 transition-colors flex items-center shadow-lg shadow-indigo-600/50 active:shadow-none cursor-pointer"
            onClick={handleCall}
            disabled={callStatus === "CONNECTING"}
          >
            <Phone className="w-5 h-5 mr-3" /> Start Call
          </Button>
        ) : (
          <div className="flex items-center gap-4">
            <Button
              className={`w-14 h-14 p-0 rounded-full backdrop-blur-lg transition-colors border-2 border-white/20 shadow-xl cursor-pointer ${
                isMuted
                  ? "bg-red-500/30 hover:bg-red-500/50"
                  : "bg-emerald-500/30 hover:bg-emerald-500/50"
              }`}
              onClick={toggleMute}
            >
              {isMuted ? (
                <MicOff className="w-6 h-6 text-red-400" />
              ) : (
                <Mic className="w-6 h-6 text-emerald-400" />
              )}
            </Button>

            <Button
              className="w-16 h-16 p-0 rounded-full bg-red-600 hover:bg-red-700 transition-colors shadow-2xl shadow-red-600/50 cursor-pointer"
              onClick={handleEnd}
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
