"use client";
import { Globe } from "./Globe";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { memo, useEffect } from "react";

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

function GlobeCanvas({
  isCallInProgress,
}: {
  isCallInProgress: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [8, 8, 8], fov: 50 }}
      className="h-full"
      frameloop="demand"
      dpr={[1, 1.25]}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <Globe isActive={isCallInProgress} />
      <DemandInvalidator enabled={isCallInProgress} />
      <OrbitControls
        enableZoom={false}
        enableRotate={false}
        autoRotate={false}
        enableDamping={false}
      />
    </Canvas>
  );
}
export default memo(GlobeCanvas);
