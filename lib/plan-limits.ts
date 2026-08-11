export const PLAN_LIMITS = {
  free: {
    name: "Free",
    maxCompanions: 1,
    dailyLimit: 360,
    sessionLimit: 120,
  },
  pro: {
    name: "Pro",
    maxCompanions: 100,
    sessionLimit: 900,
  },
  king: {
    name: "King",
    maxCompanions: 500,
    sessionLimit: 3600,
  },
};

export type PlanType = keyof typeof PLAN_LIMITS;
