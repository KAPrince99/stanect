"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import throttle from "lodash.throttle";
import * as THREE from "three";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import DeleteCompanionButton from "@/components/ui/deleteCompanionButton";
import ConvoSkeleton from "./convoSkeleton";
import { getSingleCompanion } from "@/app/(app)/actions/actions";
import { vapiSdk } from "@/lib/vapiSdk";

import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Zap,
  Radio,
  CheckCircle2,
  MessageCircle,
  X,
} from "lucide-react";

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
}

const statusConfig = {
  [CallStatus.CONNECTING]: {
    label: "Connecting to her...",
    icon: <Radio className="w-4 h-4 animate-pulse" />,
    color: "bg-amber-500/20 border-amber-500/50 text-amber-300",
  },
  [CallStatus.ACTIVE]: {
    label: "Live • She can hear you",
    icon: <Zap className="w-4 h-4 animate-pulse" />,
    color: "bg-emerald-500/20 border-emerald-500/50 text-emerald-300",
  },
  default: {
    label: "Ready to talk",
    icon: null,
    color: "bg-blue-500/20 border-blue-500/40 text-blue-300",
  },
};

// Globe shaders with orange gradient and vibration support
const vertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec3 vNormal;

  void main() {
    // Gradient: base orange to bright accent
    vec3 baseColor = vec3(0.91, 0.55, 0.19);   // #e88c30
    vec3 brightOrange = vec3(1.0, 0.65, 0.33); // #ffa550

    // Vertical gradient + soft pulsing
    float glow = 0.2 + 0.15 * sin(uTime * 2.0);
    float gradient = (vNormal.y + 1.0) / 2.0;
    vec3 finalColor = mix(baseColor, brightOrange, gradient + glow);

    gl_FragColor = vec4(finalColor,1.0);
  }
`;

const Globe = ({ isActive }: { isActive: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useRef({ uTime: { value: 0 } });

  useFrame((state) => {
    uniforms.current.uTime.value = state.clock.getElapsedTime();

    if (isActive && meshRef.current) {
      // Vibrate / pulse when call is active
      const t = state.clock.getElapsedTime();
      meshRef.current.rotation.x += 0.002 * Math.sin(t * 20);
      meshRef.current.rotation.y += 0.002 * Math.cos(t * 20);
      const scale = 1 + 0.015 * Math.sin(t * 10);
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef} rotation={[0.4, 0.6, 0]}>
      <icosahedronGeometry args={[3.2, 40]} />
      <shaderMaterial
        uniforms={uniforms.current}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.DoubleSide}
        wireframe={false}
      />
    </mesh>
  );
};

export default function Convo({ id }: ConvoProps) {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [statusLabel, setStatusLabel] = useState("Ready to talk");
  const transcriptRef = useRef<HTMLDivElement>(null);

  const { user } = useUser();

  // Screen size detection
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { data: companion, isLoading } = useQuery({
    queryKey: ["companions", id],
    queryFn: async () => getSingleCompanion(id),
  });

  const throttledMessage = useRef(
    throttle((msg: any) => {
      if (
        msg.type === "transcript" &&
        msg.transcriptType === "final" &&
        msg.transcript
      ) {
        setMessages((prev) => [
          { role: msg.role, content: msg.transcript },
          ...prev,
        ]);
      }
    }, 150)
  );

  const handleVapiMessage = useCallback((msg: any) => {
    throttledMessage.current(msg);
  }, []);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      setStatusLabel("Live • She can hear you");
    };
    const onCallEnd = () => {
      setCallStatus(CallStatus.INACTIVE);
      setIsMuted(false);
      setStatusLabel("Call ended");
      setTimeout(() => setStatusLabel("Ready to talk"), 2000);
    };
    const onError = () => setCallStatus(CallStatus.INACTIVE);

    vapiSdk.on("call-start", onCallStart);
    vapiSdk.on("call-end", onCallEnd);
    vapiSdk.on("error", onError);
    vapiSdk.on("message", handleVapiMessage);

    return () => {
      vapiSdk.off("call-start", onCallStart);
      vapiSdk.off("call-end", onCallEnd);
      vapiSdk.off("error", onError);
      vapiSdk.off("message", handleVapiMessage);
    };
  }, [handleVapiMessage]);

  useEffect(() => {
    if (transcriptRef.current) transcriptRef.current.scrollTop = 0;
  }, [messages]);

  const handleCall = async () => {
    if (callStatus !== CallStatus.INACTIVE || !companion?.assistant_id) return;

    setMessages([]);
    setCallStatus(CallStatus.CONNECTING);
    setStatusLabel("Connecting to her...");

    try {
      await vapiSdk.start(companion.assistant_id);
    } catch {
      setCallStatus(CallStatus.INACTIVE);
      setStatusLabel("Ready to talk");
    }
  };

  const handleEnd = () => {
    if (callStatus !== CallStatus.ACTIVE) return;

    vapiSdk.stop();
    setCallStatus(CallStatus.INACTIVE);
    setIsMuted(false);
    setStatusLabel("Call ended");
    setTimeout(() => setStatusLabel("Ready to talk"), 2000);
  };

  const toggleMute = () => {
    vapiSdk.setMuted(!isMuted);
    setIsMuted(!isMuted);
  };

  if (isLoading) return <ConvoSkeleton />;
  if (!companion)
    return (
      <div className="text-center text-white p-10 text-xl">
        Companion not found
      </div>
    );

  const currentStatus = statusConfig[callStatus] || statusConfig.default;

  return (
    <div className="flex h-[80vh] relative text-white overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#1e4ea8]/20">
      {/* Main Conversation Area */}
      <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-4 relative z-10 overflow-y-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-8"
        >
          <div
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border backdrop-blur-xl text-sm font-medium ${currentStatus.color}`}
          >
            {currentStatus.icon} <span>{statusLabel}</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            {companion.companion_name}
          </h1>

          {callStatus === CallStatus.ACTIVE && (
            <p className="text-white/60 text-lg">
              Say something... she’s listening
            </p>
          )}
        </motion.div>

        {/* Globe */}
        <div
          className="w-full max-w-sm sm:max-w-xl md:max-w-4xl lg:max-w-5xl mx-auto"
          style={{ height: "clamp(300px, 60vh, 700px)" }}
        >
          <Canvas camera={{ position: [5, 5, 8], fov: 50 }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} />
            <Globe isActive={callStatus === CallStatus.ACTIVE} />
            <OrbitControls
              enableZoom={false}
              autoRotate
              autoRotateSpeed={0.5}
            />
          </Canvas>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 py-5 z-20">
          <DeleteCompanionButton id={id} />

          {callStatus === CallStatus.INACTIVE ? (
            <Button
              className="px-6 py-3 text-lg font-semibold rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors flex items-center"
              onClick={handleCall}
            >
              <Phone className="w-5 h-5 mr-2" /> Start Call
            </Button>
          ) : (
            <div className="flex items-center gap-4">
              <Button
                className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xl transition-colors"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <MicOff className="w-5 h-5 text-white" />
                ) : (
                  <Mic className="w-5 h-5 text-white" />
                )}
              </Button>
              <Button
                className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                onClick={handleEnd}
              >
                <PhoneOff className="w-5 h-5 text-white" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Transcript Panel */}
      {!isDesktop && (
        <AnimatePresence>
          {!showTranscript && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-4 right-4 z-30"
            >
              <Button
                className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xl transition-colors"
                onClick={() => setShowTranscript(true)}
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <AnimatePresence>
        {(showTranscript || isDesktop) && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-40 w-full max-w-sm backdrop-blur-lg md:static md:w-1/3 md:max-w-none flex flex-col border-l border-gray-700"
          >
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Transcript</h2>
              {!isDesktop && (
                <Button
                  className="p-1 rounded-full text-gray-400 hover:text-white"
                  onClick={() => setShowTranscript(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>

            <div
              ref={transcriptRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  Conversation starts here...
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-xl ${
                        msg.role === "user"
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-700 text-gray-200 rounded-bl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
