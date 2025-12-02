"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
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
  MessageCircle,
  X,
  Headset,
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
  ERROR = "ERROR",
}

const statusConfig = {
  [CallStatus.CONNECTING]: {
    label: "Connecting...",
    icon: <Radio className="w-4 h-4 animate-pulse" />,
    color: "bg-amber-500/20 border-amber-500/50 text-amber-300",
  },
  [CallStatus.ACTIVE]: {
    label: "Live • Listening",
    icon: <Zap className="w-4 h-4 animate-pulse" />,
    color: "bg-emerald-600/30 border-emerald-500/60 text-emerald-300",
  },
  [CallStatus.ERROR]: {
    label: "Connection Failed",
    icon: <X className="w-4 h-4" />,
    color: "bg-red-500/30 border-red-500/60 text-red-300",
  },
  [CallStatus.INACTIVE]: {
    label: "Ready to initiate call",
    icon: <Headset className="w-4 h-4" />,
    color: "bg-blue-600/20 border-blue-500/40 text-blue-300",
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
  uniform float uVibrationIntensity;

  void main() {
    // Richer color palette: Dark blue to vibrant gold/orange
    vec3 baseColor = vec3(0.9, 0.5, 0.2); // Vibrant Orange/Gold
    vec3 highlightColor = vec3(1.0, 0.8, 0.5); // Lighter Gold

    // Use surface normal for gradient/lighting effect
    float gradient = (vNormal.y + 1.0) / 2.0; 
    
    // Add pulsing glow effect based on time and intensity
    float pulse = 0.5 + 0.5 * sin(uTime * 3.0);
    float glow = uVibrationIntensity * pulse * 0.5;

    vec3 finalColor = mix(baseColor, highlightColor, gradient);
    finalColor += finalColor * glow; // Add glow dynamically

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const Globe = ({ isActive }: { isActive: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  // Use useMemo for uniforms to prevent unnecessary re-creations
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uVibrationIntensity: { value: 0.0 }, // Control intensity via state
    }),
    []
  );

  useFrame((state) => {
    // Update time for the shader
    uniforms.uTime.value = state.clock.getElapsedTime();

    if (meshRef.current) {
      // Constant slow rotation for visual interest
      meshRef.current.rotation.y += 0.003;

      if (isActive) {
        // Active: Gentle vibration and scale pulsing
        const t = state.clock.getElapsedTime();
        meshRef.current.rotation.x += 0.001 * Math.sin(t * 10);
        const scale = 1 + 0.02 * Math.sin(t * 5);
        meshRef.current.scale.set(scale, scale, scale);
        uniforms.uVibrationIntensity.value = 1.0; // Max intensity for active call
      } else {
        // Inactive: Smooth rotation only, reset scale, decrease vibration
        meshRef.current.scale.set(1, 1, 1);
        uniforms.uVibrationIntensity.value = Math.max(
          0,
          uniforms.uVibrationIntensity.value - 0.05
        );
      }
    }
  });

  return (
    <mesh ref={meshRef} rotation={[0.4, 0.6, 0]}>
      <icosahedronGeometry args={[3.2, 30]} />
      <shaderMaterial
        uniforms={uniforms}
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
  const transcriptRef = useRef<HTMLDivElement>(null);

  const { data: companion, isLoading } = useQuery({
    queryKey: ["companions", id],
    queryFn: async () => getSingleCompanion(id),
  });

  // Use a ref for the throttled function to ensure stable dependency
  const throttledMessage = useRef(
    throttle((msg: any) => {
      if (
        (msg.type === "transcript" || msg.type === "speech") &&
        msg.transcriptType === "final" &&
        msg.transcript
      ) {
        setMessages((prev) => [
          { role: msg.role, content: msg.transcript },
          ...prev, // Prepend new messages to show newest first
        ]);
      }
    }, 200) // Slightly increased throttle for smooth transcript update
  );

  const handleVapiMessage = useCallback((msg: any) => {
    throttledMessage.current(msg);
  }, []);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      setShowTranscript(true); // Automatically show transcript on call start
    };
    const onCallEnd = () => {
      setCallStatus(CallStatus.INACTIVE);
      setIsMuted(false);
    };
    const onError = (e: any) => {
      console.error("VAPI Error:", e);
      setCallStatus(CallStatus.ERROR);
      setTimeout(() => setCallStatus(CallStatus.INACTIVE), 5000);
    };

    // Setup listeners
    vapiSdk.on("call-start", onCallStart);
    vapiSdk.on("call-end", onCallEnd);
    vapiSdk.on("error", onError);
    vapiSdk.on("message", handleVapiMessage);

    // Cleanup listeners
    return () => {
      vapiSdk.off("call-start", onCallStart);
      vapiSdk.off("call-end", onCallEnd);
      vapiSdk.off("error", onError);
      vapiSdk.off("message", handleVapiMessage);
      // Ensure vapi is stopped if component unmounts while active
      if (callStatus === CallStatus.ACTIVE) {
        vapiSdk.stop();
      }
    };
  }, [handleVapiMessage, callStatus]);

  // Auto-scroll to top when messages update
  useEffect(() => {
    if (transcriptRef.current) transcriptRef.current.scrollTop = 0;
  }, [messages]);

  const handleCall = async () => {
    if (callStatus !== CallStatus.INACTIVE || !companion?.assistant_id) return;

    setMessages([]); // Clear previous transcript
    setCallStatus(CallStatus.CONNECTING);

    try {
      // VAPI SDK call to start the voice interaction
      await vapiSdk.start(companion.assistant_id);
    } catch (e) {
      console.error("Failed to start VAPI call:", e);
      setCallStatus(CallStatus.ERROR);
      setTimeout(() => setCallStatus(CallStatus.INACTIVE), 3000);
    }
  };

  const handleEnd = () => {
    if (
      callStatus === CallStatus.ACTIVE ||
      callStatus === CallStatus.CONNECTING
    ) {
      vapiSdk.stop();
    }
  };

  const toggleMute = () => {
    if (callStatus === CallStatus.ACTIVE) {
      vapiSdk.setMuted(!isMuted);
      setIsMuted((prev) => !prev);
    }
  };

  if (isLoading) return <ConvoSkeleton />;
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
    callStatus === CallStatus.ACTIVE || callStatus === CallStatus.CONNECTING;
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024; // Check based on Tailwind 'lg'

  return (
    // Updated: Use h-full/w-full to fill parent container (which handles fixed header/sidebar)
    <div className="flex w-full h-full relative text-white bg-transparent overflow-hidden lg:flex-row flex-col">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="w-full h-full bg-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-yellow-500/5 blur-[100px]"></div>
      </div>

      {/* Main Conversation Area (Left/Center) */}
      {/* Updated: h-full and flex-col to enable internal vertical flex flow. justify-between ensures controls are at the bottom. */}
      <div className="flex-1 flex flex-col items-center justify-between p-4 lg:p-10 relative z-10 overflow-y-auto h-full">
        {/* Top Section: Header and Status - flex-shrink-0 prevents it from shrinking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 pt-10 pb-8 max-w-lg w-full flex-shrink-0"
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
            {companion.companion_name || "AI Companion"}
          </h1>

          {callStatus === CallStatus.ACTIVE && (
            <p className="text-white/70 text-base md:text-lg animate-pulse-slow">
              **Speak now...** she is processing your voice input.
            </p>
          )}
        </motion.div>

        {/* Middle Section: Globe 3D Canvas - Uses flex-1 to fill remaining vertical space */}
        <div
          className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-indigo-900/50 border border-gray-800 flex-1 my-4"
          style={{ minHeight: "300px", maxHeight: "70vh" }} // Use min/max height for control but flex-1 drives the main size
        >
          {/* Ensure the canvas fills its container */}
          <Canvas camera={{ position: [5, 5, 8], fov: 50 }}>
            <ambientLight intensity={0.5} color="#ffffff" />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1.5}
              color="#ffddaa"
            />
            <Globe isActive={callStatus === CallStatus.ACTIVE} />
            <OrbitControls
              enableZoom={false}
              autoRotate={!isCallInProgress} // Stop auto-rotate during call for immersion
              autoRotateSpeed={0.5}
              enableDamping // Smoother controls
              dampingFactor={0.1}
            />
          </Canvas>
        </div>

        {/* Bottom Section: Action Buttons - flex-shrink-0 ensures this fixed-height content doesn't shrink */}
        <div className="flex justify-center items-center gap-6 py-8 z-20 flex-shrink-0">
          <DeleteCompanionButton id={id} />

          {!isCallInProgress ? (
            <Button
              className="px-8 py-3 text-xl font-bold rounded-full bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center shadow-lg shadow-indigo-600/50 active:shadow-none"
              onClick={handleCall}
              disabled={callStatus === CallStatus.CONNECTING}
            >
              <Phone className="w-5 h-5 mr-3" /> Start Call
            </Button>
          ) : (
            <div className="flex items-center gap-4">
              <Button
                className={`w-14 h-14 p-0 rounded-full backdrop-blur-lg transition-colors border-2 border-white/20 shadow-xl ${
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
                className="w-16 h-16 p-0 rounded-full bg-red-600 hover:bg-red-700 transition-colors shadow-2xl shadow-red-600/50"
                onClick={handleEnd}
              >
                <PhoneOff className="w-7 h-7 text-white" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Transcript Toggle Button */}
      {!isDesktop && (
        <AnimatePresence>
          {!showTranscript && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-6 right-6 z-40"
            >
              <Button
                className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 shadow-xl shadow-gray-700/50 border border-gray-600"
                onClick={() => setShowTranscript(true)}
              >
                <MessageCircle className="w-6 h-6 text-white" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Transcript Panel (Right Sidebar) */}
      <AnimatePresence>
        {(showTranscript || isDesktop) && (
          <motion.div
            initial={isDesktop ? false : { opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            // Updated: Used lg:flex-shrink-0 to guarantee fixed width on desktop
            className="fixed inset-y-0 right-0 z-50 w-full max-w-sm lg:static lg:w-[380px] lg:flex-shrink-0 flex flex-col bg-gray-800/95 backdrop-blur-lg border-l border-gray-700 shadow-2xl lg:shadow-none h-full"
          >
            <div className="p-5 border-b border-gray-700 flex items-center justify-between bg-gray-900/50 flex-shrink-0">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-indigo-400" /> Live
                Transcript
              </h2>
              {!isDesktop && (
                <Button
                  className="p-2 rounded-full text-gray-400 hover:text-white bg-transparent hover:bg-white/10"
                  onClick={() => setShowTranscript(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>

            <div
              ref={transcriptRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col-reverse" // flex-1 ensures it fills remaining vertical space
            >
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 p-10 mt-auto">
                  <p className="font-medium text-lg">
                    Your conversation will appear here.
                  </p>
                  <p className="text-sm mt-1">Ready to talk when you are.</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-md transition-all duration-300 ${
                        msg.role === "user"
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-gray-700 text-gray-100 rounded-tl-none"
                      } ${msg.role === "user" ? "font-medium" : "font-normal"}`}
                    >
                      <div className="text-xs font-semibold mb-1 opacity-70">
                        {msg.role === "user" ? "You" : companion.companion_name}
                      </div>
                      {msg.content}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
