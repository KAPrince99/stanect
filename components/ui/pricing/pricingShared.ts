import { motionTransition } from "@/lib/motion";

export type BillingInterval = "monthly" | "yearly";

/** Homepage sells plans. In-app pricing manages the subscription. */
export type PricingIntent = "billing" | "marketing";

/** Stack on phones, two on tablet, three on desktop. */
export const PRICING_TIER_GRID =
  "grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3";

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
