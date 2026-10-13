"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import { getSingleCompanion, getUser } from "@/app/(app)/actions/actions";
import { fetchSubscriptionStatus } from "@/app/(app)/actions/subs";

export type UserPlan = "free" | "pro" | "king";

export const FALLBACK_USER_AVATAR = "/avatars/avatar_0.jpg";

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

  // Same key as the sidebar and profile, so this reuses their cached account.
  // The picture is cosmetic: it never holds the call screen back.
  const { data: profile } = useQuery({
    queryKey: ["users", user?.id],
    queryFn: () => getUser(),
    enabled: !!user?.id,
    staleTime: Infinity,
  });

  return {
    companion: companion ?? null,
    isLoading: isCompanionLoading || isSubscriptionLoading,
    userPlan: normalizeUserPlan(subscriptionData?.plan),
    userAvatarUrl:
      profile?.profile_picture || user?.imageUrl || FALLBACK_USER_AVATAR,
  };
}
