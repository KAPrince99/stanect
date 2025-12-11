"use client";

import { fragmentShader, vertexShader } from "@/app/constants";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export const Globe = ({ isActive }: { isActive: boolean }) => {
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
        uniforms={uniforms}
        side={THREE.DoubleSide}
        //@ts-ignore
        flatShading
        wireframe
      />
    </mesh>
  );
};
