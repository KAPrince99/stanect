"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef, ReactNode } from "react";

const LenisContext = createContext<() => Lenis | null>(() => null);

export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenisInstance = new Lenis({
      duration: 1.5,
      lerp: 0.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenisRef.current = lenisInstance;

    const raf = (time: number) => {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => {
      lenisInstance.destroy();
      lenisRef.current = null;
    };
  }, []);

  const getLenis = () => lenisRef.current;

  return (
    <LenisContext.Provider value={getLenis}>{children}</LenisContext.Provider>
  );
}

export const useLenisInstance = () => {
  const getLenis = useContext(LenisContext);
  return getLenis();
};
