import { PLAN_LIMITS, PlanType } from "./plan-limits";

export function isTrialExpired(createdAt: string) {
  const signupDate = new Date(createdAt);
  const now = new Date();
  const diffInDays =
    (now.getTime() - signupDate.getTime()) / (1000 * 3600 * 24);
  return diffInDays > 7;
}

export function canUserCall(userData: any) {
  const { plan, created_at, daily_seconds_used } = userData;

  if (plan === "pro" || plan === "king") return { allowed: true };

  if (isTrialExpired(created_at)) {
    return { allowed: false, reason: "TRIAL_EXPIRED" };
  }

  if (daily_seconds_used >= 360) {
    return { allowed: false, reason: "DAILY_LIMIT_REACHED" };
  }

  return { allowed: true };
}

export function getMaxCompanions(plan: PlanType): number {
  return PLAN_LIMITS[plan].maxCompanions;
}

export function hasReachedCompanionLimit(
  currentCount: number,
  plan: PlanType
): boolean {
  return currentCount >= getMaxCompanions(plan);
}
