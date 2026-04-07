"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import { getSingleCompanion } from "@/app/(app)/actions/actions";
import { fetchSubscriptionStatus } from "@/app/(app)/actions/subs";

export type UserPlan = "free" | "pro" | "king";

function normalizeUserPlan(plan: unknown): UserPlan {
  return plan === "pro" || plan === "king" ? plan : "free";
}

export function useConvoData(id: string) {
  const { user } = useUser();

  const { data: companion, isLoading: isCompanionLoading } = useQuery({
    queryKey: ["companions", id],
    queryFn: () => getSingleCompanion(id),
    staleTime: Infinity,
  });

  const { data: subscriptionData, isLoading: isSubscriptionLoading } = useQuery(
    {
      queryKey: ["userPlan", user?.id],
      queryFn: () => fetchSubscriptionStatus(user?.id || ""),
      enabled: !!user?.id,
    },
  );

  return {
    companion: companion ?? null,
    isLoading: isCompanionLoading || isSubscriptionLoading,
    userPlan: normalizeUserPlan(subscriptionData?.plan),
  };
}
