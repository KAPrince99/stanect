"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bounds, OrbitControls } from "@react-three/drei";
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
  varying vec2 vUv;
  varying float vElevation;
  varying float vShadow;

  uniform float uTime;

  // --- Perlin Noise helpers (Ashima Arts) ---
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float perlinNoise3D(vec3 P) {
    vec3 i0 = floor(P);
    vec3 i1 = i0 + vec3(1.0);
    vec3 f0 = fract(P);
    vec3 f1 = f0 - vec3(1.0);
    vec3 f = f0 * f0 * (3.0 - 2.0 * f0);

    vec4 ix = vec4(i0.x, i1.x, i0.x, i1.x);
    vec4 iy = vec4(i0.y, i0.y, i1.y, i1.y);
    vec4 iz0 = vec4(i0.z);
    vec4 iz1 = vec4(i1.z);

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = fract(ixy0 * (1.0 / 41.0)) * 2.0 - 1.0;
    vec4 gy0 = abs(gx0) - 0.5;
    vec4 gz0 = floor(gx0 + 0.5);
    gx0 -= gz0;

    vec4 gx1 = fract(ixy1 * (1.0 / 41.0)) * 2.0 - 1.0;
    vec4 gy1 = abs(gx1) - 0.5;
    vec4 gz1 = floor(gx1 + 0.5);
    gx1 -= gz1;

    vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
    vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
    vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
    vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
    vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
    vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
    vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
    vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(
      dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)
    ));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;

    vec4 norm1 = taylorInvSqrt(vec4(
      dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)
    ));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, f0);
    float n100 = dot(g100, vec3(f1.x, f0.yz));
    float n010 = dot(g010, vec3(f0.x, f1.y, f0.z));
    float n110 = dot(g110, vec3(f1.xy, f0.z));
    float n001 = dot(g001, vec3(f0.xy, f1.z));
    float n101 = dot(g101, vec3(f1.x, f0.y, f1.z));
    float n011 = dot(g011, vec3(f0.x, f1.yz));
    float n111 = dot(g111, f1);

    vec3 fade_xyz = f * f * (3.0 - 2.0 * f);
    vec4 n_z = mix(
      vec4(n000, n100, n010, n110),
      vec4(n001, n101, n011, n111),
      fade_xyz.z
    );
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);

    return 2.2 * n_xyz;
  }

  void main() {
    vUv = uv;

    float noiseFreq = 5.0;
    float noiseAmp = 0.25;

    vec3 pos = position;
    float n = perlinNoise3D(pos * noiseFreq + uTime * 0.7);
    pos += normal * n * noiseAmp;

    vElevation = pos.y;
    vec3 displacedNormal = normalize(normal + vec3(0.0, n * noiseAmp, 0.0));
    float shadow = clamp(dot(displacedNormal, vec3(0.0, 2.0, 0.0)), 0.0, 1.0);
    vShadow = shadow;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  precision mediump float;

  varying vec2 vUv;
  varying float vElevation;
  varying float vShadow;

  uniform float uColorChange;

  void main() {
    // Tailwind amber-600 palette (converted from 0-255 RGB to 0.0-1.0)
    vec4 c1 = vec4(1.0, 0.81, 0.05, 1.0);     // Lighter amber (similar to 400/500)
    vec4 c2 = vec4(0.85, 0.47, 0.02, 1.0);    // The main amber-600 color (217, 119, 6)
    vec4 c3 = vec4(0.64, 0.33, 0.04, 1.0);    // Darker amber (similar to 700)
    vec4 c4 = vec4(0.47, 0.21, 0.06, 1.0);    // Darker amber (similar to 800)

    float dist = distance(vUv, vec2(0.5, 0.5));
    float organic = smoothstep(0.0, 0.7, dist);

    float noise = fract(sin(dot(vUv * 100.0, vec2(12.9898,78.233))) * 43758.5453);
    float blendFactor = mix(organic, noise, 0.18);

    vec4 colormixone = mix(c1, c2, blendFactor);
    vec4 colormixtwo = mix(c3, c4, blendFactor);

    vec4 final = mix(colormixone, colormixtwo, uColorChange);

    gl_FragColor = final;
  }
`;

const Globe = ({ isActive }: { isActive: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  // Use useMemo for uniforms to prevent unnecessary re-creations
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uVibrationIntensity: { value: 0.0 }, // Control intensity via active state
      uColorChange: { value: 0.0 }, // New uniform
    }),
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // 1. Update time for the shader
    uniforms.uTime.value = t;

    // 2. Color shift logic (from user's request)
    uniforms.uColorChange.value = (Math.sin(t / 2) + 1) / 2;

    if (meshRef.current) {
      // 3. Constant slow rotation for visual interest
      meshRef.current.rotation.y += 0.003;

      // 4. Active/Inactive logic (from original component)
      if (isActive) {
        // Active: Gentle vibration and scale pulsing
        meshRef.current.rotation.x += 0.001 * Math.sin(t * 10);
        const scale = 1 + 0.02 * Math.sin(t * 5);
        meshRef.current.scale.set(scale, scale, scale);
        uniforms.uVibrationIntensity.value = 1.0; // Max intensity for active call
      } else {
        // Inactive: Smooth rotation only, reset scale, decrease vibration
        meshRef.current.scale.set(1, 1, 1);
        // Gently decrease vibration intensity after call ends
        uniforms.uVibrationIntensity.value = Math.max(
          0,
          uniforms.uVibrationIntensity.value - 0.05
        );
      }
    }
  });

  return (
    <mesh ref={meshRef} rotation={[0.4, 0.6, 0]}>
      <icosahedronGeometry args={[5.5, 80]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.uVibrationIntensity}
        side={THREE.DoubleSide}
        //@ts-ignore
        flatShading
        wireframe
      />
    </mesh>
  );
};

export default function Convo({ id }: ConvoProps) {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [globeScale, setGlobeScale] = useState(1);
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
    <div className="flex w-full h-full relative text-white   overflow-hidden lg:flex-row flex-col  md:px-10  ">
      {/* Main Conversation Area (Left/Center) */}
      {/* Updated: h-full and flex-col to enable internal vertical flex flow. justify-between ensures controls are at the bottom. */}
      <div className="flex-1 flex flex-col items-center justify-between  relative z-10 overflow-y-auto h-full  px-2 ">
        {/* Top Section: Header and Status - flex-shrink-0 prevents it from shrinking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 pt-2 pb-4 max-w-lg w-full flex-shrink-0"
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
          className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-indigo-900/50 border border-gray-800 my-4"
          style={{ height: "300px" }}
        >
          {/* Ensure the canvas fills its container */}

          <Canvas
            camera={{ position: [8, 8, 8], fov: 50 }}
            className=" h-full
          "
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} />

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
              className="px-8 py-3 text-xl font-bold rounded-full bg-green-500 hover:bg-amber-700 transition-colors flex items-center shadow-lg shadow-indigo-600/50 active:shadow-none"
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
              className="fixed bottom-20 right-6 z-100"
            >
              <Button
                className="p-4 rounded-full bg-amber-700 hover:bg-gray-600 shadow-xl shadow-gray-700/50 border border-gray-600"
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
            className=" w-full h-full overflow-y-auto lg:w-[300px] xl:w-sm  flex flex-col  backdrop-blur-lg border-l border-gray-700 shadow-2xl lg:shadow-none   "
          >
            <div className="p-5 border-b border-gray-700 flex items-center justify-between bg-gray-900/50 flex-shrink-0">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-indigo-400" /> Live
                Transcript
              </h2>
              {!isDesktop && (
                <Button
                  className="p-2 rounded-full  hover:text-white bg-transparent hover:bg-white/10 pl-4"
                  onClick={() => setShowTranscript(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>

            <div
              ref={transcriptRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col-reverse " // flex-1 ensures it fills remaining vertical space
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
