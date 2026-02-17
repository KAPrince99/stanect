"use client";
import { Globe } from "./Globe";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { memo } from "react";

function GlobeCanvas({
  callStatus,
  isCallInProgress,
}: {
  callStatus: string;
  isCallInProgress: boolean;
}) {
  return (
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
  );
}
export default memo(GlobeCanvas);
