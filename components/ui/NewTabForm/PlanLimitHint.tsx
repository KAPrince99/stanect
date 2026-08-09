import React, { memo } from "react";
import { Crown, ShieldCheck } from "lucide-react";
import type { PlanType } from "@/lib/plan-limits";

interface PlanLimitHintProps {
  userPlan: PlanType;
  maxMinutes: number;
}

function PlanLimitHint({ userPlan, maxMinutes }: PlanLimitHintProps) {
  return (
    <div className="flex items-center gap-2 px-1 mt-2">
      {userPlan === "free" ? (
        <ShieldCheck className="w-3 h-3 text-amber-500" />
      ) : (
        <Crown className="w-3 h-3 text-emerald-400 animate-pulse" />
      )}
      <p
        className={`type-meta uppercase tracking-widest ${
          userPlan === "free" ? "text-white/50" : "text-emerald-400"
        }`}
      >
        {userPlan.toUpperCase()} Plan: Max {maxMinutes} Mins
      </p>
    </div>
  );
}

export default memo(PlanLimitHint);
