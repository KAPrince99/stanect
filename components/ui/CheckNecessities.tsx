import React from "react";
import ConvoGuard from "./convoGuard";
import { isTrialExpired } from "@/lib/plan-utils";
import { fetchUserNecessities } from "@/app/(app)/actions/actions";

export default async function CheckNecessities({ userId }: { userId: string }) {
  const userNecessaryData = await fetchUserNecessities(userId);

  const plan = userNecessaryData?.plan || "free";

  if (plan === "free") {
    if (isTrialExpired(userNecessaryData?.created_at)) {
      return (
        <div className="min-h-screen bg-transparent py-16 px-6">
          <ConvoGuard reason="trial_expired" plan={plan} />
        </div>
      );
    }

    if ((userNecessaryData?.daily_seconds_used || 0) >= 360) {
      return (
        <div className="min-h-screen bg-transparent py-16 px-6">
          <ConvoGuard reason="daily_limit_reached" plan={plan} />
        </div>
      );
    }
  }
  return null;
}
