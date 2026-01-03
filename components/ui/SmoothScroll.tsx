"use client";

import Lenis from "lenis";
import { ReactNode, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      autoRaf: true, // Let Lenis handle requestAnimationFrame internally
    });

    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (lenisRef.current) {
      // 1. Instantly jump to top
      lenisRef.current.scrollTo(0, { immediate: true });
      // 2. Force recalculate page height for the new route content
      lenisRef.current.resize();
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}
