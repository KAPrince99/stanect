"use client";

import { fragmentShader, vertexShader } from "@/app/constants";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export const Globe = ({ isActive }: { isActive: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const activeTimeRef = useRef(0);
  // Use useMemo for uniforms to prevent unnecessary re-creations
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uVibrationIntensity: { value: 0.0 }, // Control intensity via active state
      uColorChange: { value: 0.0 }, // New uniform
    }),
    []
  );

  useEffect(() => {
    if (!isActive) {
      // Set an explicit idle look once when the call stops.
      activeTimeRef.current = 0;
      uniforms.uVibrationIntensity.value = 0.0;
      if (meshRef.current) {
        meshRef.current.scale.set(1, 1, 1);
      }
      return;
    }

    // Start timing fresh when we re-activate.
    activeTimeRef.current = 0;
    uniforms.uTime.value = 0;
  }, [isActive, uniforms]);

  useFrame((state) => {
    if (!isActive) return;

    // With frameloop="demand", we only animate during invalidated frames.
    // Use accumulated delta time so animations don't jump after pauses.
    activeTimeRef.current += state.clock.getDelta();
    const t = activeTimeRef.current;

    // 1. Update time for the shader
    uniforms.uTime.value = t;

    // 2. Color shift logic (from user's request)
    uniforms.uColorChange.value = (Math.sin(t / 2) + 1) / 2;

    if (meshRef.current) {
      // 3. Constant slow rotation for visual interest
      meshRef.current.rotation.y += 0.003;

      // 4. Active/Inactive logic (from original component)
      // Active: Gentle vibration and scale pulsing
      meshRef.current.rotation.x += 0.001 * Math.sin(t * 10);
      const scale = 1 + 0.02 * Math.sin(t * 5);
      meshRef.current.scale.set(scale, scale, scale);
      uniforms.uVibrationIntensity.value = 1.0; // Max intensity for active call
    }
  });

  return (
    <mesh ref={meshRef} rotation={[0.4, 0.6, 0]}>
      <icosahedronGeometry args={[5.5, 64]} />
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
