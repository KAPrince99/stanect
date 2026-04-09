export type BillingInterval = "monthly" | "yearly";

export const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
} as const;
