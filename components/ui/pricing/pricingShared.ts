import { motionTransition } from "@/lib/motion";

export type BillingInterval = "monthly" | "yearly";

export const pricingFadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: {
    opacity: 1,
    y: 0,
    transition: motionTransition.soft,
  },
} as const;

/** @deprecated Use pricingFadeUp - kept so older imports keep compiling. */
export const fadeUp = pricingFadeUp;

export const pricingStagger = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.06,
    },
  },
} as const;
