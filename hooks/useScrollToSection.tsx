"use client";

import { useLenisInstance } from "@/app/providers/lenisProvider";

export const useScrollToSection = () => {
  const lenis = useLenisInstance();

  const scrollToSection = (id: string) => {
    if (!lenis) return;

    lenis.scrollTo(`#${id}`, {
      offset: -80, // fixed header offset
      immediate: false,
    });
  };

  return { scrollToSection };
};
