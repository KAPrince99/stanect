"use client";
import { Globe } from "./Globe";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { memo, useEffect, useRef } from "react";

function DemandInvalidator({ enabled }: { enabled: boolean }) {
  const { invalidate } = useThree();

  useEffect(() => {
    if (!enabled) return;

    let raf = 0;
    const loop = () => {
      invalidate();
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [enabled, invalidate]);

  return null;
}

/** Draws two frames, then tells the call screen the globe is actually on screen. */
function FirstPaint({ onReady }: { onReady?: () => void }) {
  const { invalidate } = useThree();
  const frames = useRef(0);
  const signalled = useRef(false);

  useEffect(() => {
    invalidate();
  }, [invalidate]);

  useFrame(() => {
    if (signalled.current) return;

    frames.current += 1;
    if (frames.current < 2) {
      invalidate();
      return;
    }

    signalled.current = true;
    requestAnimationFrame(() => onReady?.());
  });

  return null;
}

/** Kick one frame when the parked globe is shown again (demand loop is idle). */
function Wake({ awake }: { awake: boolean }) {
  const { invalidate } = useThree();

  useEffect(() => {
    if (awake) invalidate();
  }, [awake, invalidate]);

  return null;
}

function GlobeCanvas({
  isCallLive,
  awake = true,
  onReady,
}: {
  isCallLive: boolean;
  awake?: boolean;
  onReady?: () => void;
}) {
  return (
    <Canvas
      camera={{ position: [8, 8, 8], fov: 50 }}
      className="h-full w-full"
      frameloop="demand"
      dpr={[1, 1.25]}
      // Avoid tearing down the GL context when React reconciles parents.
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <Globe isActive={isCallLive} />
      <FirstPaint onReady={onReady} />
      <Wake awake={awake} />
      <DemandInvalidator enabled={isCallLive} />
      <OrbitControls
        enableZoom={false}
        enableRotate={false}
        autoRotate={false}
        enableDamping={false}
      />
    </Canvas>
  );
}

export default memo(
  GlobeCanvas,
  (prev, next) =>
    prev.isCallLive === next.isCallLive &&
    prev.awake === next.awake &&
    prev.onReady === next.onReady,
);
