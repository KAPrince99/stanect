export const PLAN_LIMITS = {
  free: {
    name: "Free",
    maxCompanions: 1,
    dailyLimit: 120,
    memory: "Basic (24h)",
    latency: "Standard",
    canUsePremiumAvatars: false,
  },
  pro: {
    name: "Pro",
    maxCompanions: 100,
    sessionLimit: 900,
    memory: "Extended (7 Days)",
    latency: "Fast",
    canUsePremiumAvatars: true,
  },
  king: {
    name: "King",
    maxCompanions: 500,
    sessionLimit: 3600,
    memory: "Infinite / Full Context",
    latency: "Ultra-Low (VIP)",
    canUsePremiumAvatars: true,
  },
};

export type PlanType = keyof typeof PLAN_LIMITS;
