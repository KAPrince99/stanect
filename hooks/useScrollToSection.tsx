"use client";
import { useLenis } from "@studio-freight/react-lenis";

export const useScrollToSection = () => {
  const lenis = useLenis();

  const scrollToSection = (id: string) => {
    if (!lenis) return;

    lenis.scrollTo(`#${id}`, {
      offset: 80,
      duration: 1.5,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      immediate: false,
    });
  };
  return { scrollToSection };
};
