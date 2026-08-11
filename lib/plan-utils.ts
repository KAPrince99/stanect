import { PLAN_LIMITS, PlanType } from "./plan-limits";

export function isTrialExpired(createdAt: string) {
  const signupDate = new Date(createdAt);
  const now = new Date();
  const diffInDays =
    (now.getTime() - signupDate.getTime()) / (1000 * 3600 * 24);
  return diffInDays > 7;
}

export function canUserCall(userData: {
  plan?: string | null;
  created_at?: string | null;
  daily_seconds_used?: number | null;
}) {
  const plan = (userData.plan || "free").toString().toLowerCase();
  const dailySecondsUsed = Number(userData.daily_seconds_used ?? 0);

  if (plan === "pro" || plan === "king") return { allowed: true as const };

  if (isTrialExpired(userData.created_at ?? "")) {
    return { allowed: false as const, reason: "TRIAL_EXPIRED" as const };
  }

  if (dailySecondsUsed >= PLAN_LIMITS.free.dailyLimit) {
    return { allowed: false as const, reason: "DAILY_LIMIT_REACHED" as const };
  }

  return { allowed: true as const };
}

export function getMaxCompanions(plan: PlanType): number {
  return PLAN_LIMITS[plan].maxCompanions;
}

export function hasReachedCompanionLimit(
  currentCount: number,
  plan: PlanType,
): boolean {
  return currentCount >= getMaxCompanions(plan);
}
