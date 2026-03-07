import type { Transition, Variants } from "framer-motion";

export const motionTransition = {
  smooth: {
    type: "spring",
    stiffness: 420,
    damping: 34,
    mass: 0.5,
  } satisfies Transition,
  tabSnap: {
    type: "spring",
    stiffness: 520,
    damping: 40,
    mass: 0.42,
  } satisfies Transition,
  soft: {
    duration: 0.24,
    ease: [0.16, 1, 0.3, 1],
  } satisfies Transition,
};

export const motionVariants = {
  fadeUp: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  } satisfies Variants,

  tabContentSlide: {
    initial: (direction: number = 1) => ({
      opacity: 0,
      x: direction > 0 ? 16 : -16,
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 520,
        damping: 40,
        mass: 0.42,
      },
    },
    exit: (direction: number = 1) => ({
      opacity: 0,
      x: direction > 0 ? -16 : 16,
      transition: {
        duration: 0.08,
        ease: [0.4, 0, 1, 1],
      },
    }),
  } satisfies Variants,

  cardPop: {
    initial: { opacity: 0, scale: 0.94 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 },
  } satisfies Variants,
} as const;
