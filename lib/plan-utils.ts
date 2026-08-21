import { PLAN_LIMITS, PlanType } from "./plan-limits";

export const LAST_USAGE_DATE_KEY = "last_usage_date";

type UserData = {
  plan?: string | null;
  created_at?: string | null;
  daily_seconds_used?: number | null;
  last_usage_date?: string | null;
};

export function utcDateKey(iso?: string | null) {
  const date = iso ? new Date(iso) : new Date();
  if (!Number.isFinite(date.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  return date.toISOString().slice(0, 10);
}

export function readLastUsageDate(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== "object") return null;
  const value = (metadata as Record<string, unknown>)[LAST_USAGE_DATE_KEY];
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? value
    : null;
}

/** Stored daily seconds that still count toward today's free credit. */
export function effectiveDailySecondsUsed(input: {
  daily_seconds_used?: number | null;
  last_usage_date?: string | null;
}): number {
  const used = Math.max(0, Number(input.daily_seconds_used ?? 0));
  const lastUsageDate = input.last_usage_date ?? null;
  if (lastUsageDate && lastUsageDate !== utcDateKey()) return 0;
  return used;
}

export function isTrialExpired(createdAt: string) {
  const signupDate = new Date(createdAt);
  const now = new Date();
  const diffInDays =
    (now.getTime() - signupDate.getTime()) / (1000 * 3600 * 24);
  return diffInDays > 7;
}

export function canUserCall(userData: UserData) {
  const plan = (userData.plan || "free").toString().toLowerCase();
  const dailySecondsUsed = effectiveDailySecondsUsed({
    daily_seconds_used: userData.daily_seconds_used,
    last_usage_date: userData.last_usage_date,
  });

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
