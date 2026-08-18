import { PLAN_LIMITS, type PlanType } from "@/lib/plan-limits";
import { canUserCall } from "@/lib/plan-utils";

export type UsageTone = "ok" | "low" | "blocked" | "paid";

type User = {
  plan?: string | null;
  created_at?: string | null;
  daily_seconds_used?: number | null;
};

export function resolvePlanLabel(plan?: string | null): string {
  const key = (plan || "free").toString().toLowerCase();
  if (key === "pro") return "Pro";
  if (key === "king") return "King";
  return "Free";
}

export function resolvePracticeUsage(user: User): {
  label: string;
  tone: UsageTone;
  planLabel: string;
} {
  const plan = (user.plan || "free").toString().toLowerCase() as PlanType;
  const planLabel = resolvePlanLabel(plan);
  const access = canUserCall({
    plan,
    created_at: user.created_at,
    daily_seconds_used: user.daily_seconds_used,
  });

  if (plan === "pro" || plan === "king") {
    return {
      planLabel,
      label: planLabel,
      tone: "paid",
    };
  }

  if (!access.allowed && access.reason === "TRIAL_EXPIRED") {
    return {
      planLabel,
      label: "Trial ended · upgrade to continue",
      tone: "blocked",
    };
  }

  const used = Math.max(0, Number(user.daily_seconds_used ?? 0));
  const remaining = Math.max(0, PLAN_LIMITS.free.dailyLimit - used);
  const minutesLeft = Math.ceil(remaining / 60);

  if (remaining <= 0) {
    return { planLabel, label: "Daily limit reached", tone: "blocked" };
  }

  if (minutesLeft <= 2) {
    return {
      planLabel,
      label: `${minutesLeft} min left today`,
      tone: "low",
    };
  }

  return {
    planLabel,
    label: `${minutesLeft} min left today`,
    tone: "ok",
  };
}
