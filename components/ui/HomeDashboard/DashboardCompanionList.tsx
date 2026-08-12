"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { memo, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { getCompanions, getUser } from "@/app/(app)/actions/actions";
import { getLastCompanionId } from "@/lib/last-companion";
import { hasReachedCompanionLimit } from "@/lib/plan-utils";
import type { PlanType } from "@/lib/plan-limits";
import { resolvePracticeUsage } from "@/lib/practice-usage";
import type { CompanionProps } from "@/types/types";

import DashboardCompanionsView from "./DashboardCompanionsView";

interface DashboardCompanionListProps {
  userId: string;
}

function pickContinueCompanion(companions: CompanionProps[]) {
  if (companions.length === 0) return null;

  const lastId = getLastCompanionId();
  if (lastId) {
    const match = companions.find((companion) => companion.id === lastId);
    if (match) return match;
  }

  return companions[0];
}

function DashboardCompanionList({ userId }: DashboardCompanionListProps) {
  const { user } = useUser();
  const router = useRouter();
  const [isStartingSetup, startTransition] = useTransition();
  const [lastCompanionId, setLastCompanionIdState] = useState<string | null>(
    null,
  );

  useEffect(() => {
    setLastCompanionIdState(getLastCompanionId());
  }, []);

  const { data: companions = [], isLoading: isCompanionsLoading } = useQuery({
    queryKey: ["companions", userId],
    queryFn: () => getCompanions(),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  const welcomeUser = useMemo(
    () => user?.firstName || "there",
    [user?.firstName],
  );

  const continueCompanion = useMemo(() => {
    void lastCompanionId;
    return pickContinueCompanion(companions);
  }, [companions, lastCompanionId]);

  const canCreateCompanion = useMemo(() => {
    const plan = (userData?.plan || "free").toString().toLowerCase();
    const planKey = (
      plan === "pro" || plan === "king" ? plan : "free"
    ) as PlanType;
    return !hasReachedCompanionLimit(companions.length, planKey);
  }, [companions.length, userData?.plan]);

  const usage = useMemo(
    () =>
      resolvePracticeUsage({
        plan: userData?.plan,
        created_at: userData?.created_at,
        daily_seconds_used: userData?.daily_seconds_used,
      }),
    [userData?.created_at, userData?.daily_seconds_used, userData?.plan],
  );

  return (
    <DashboardCompanionsView
      companions={companions}
      welcomeUser={welcomeUser}
      continueCompanion={continueCompanion}
      canCreateCompanion={canCreateCompanion}
      planBadgeLabel={usage.planLabel}
      planBadgeTone={usage.tone}
      isLoading={isCompanionsLoading || isUserLoading}
      isStartingSetup={isStartingSetup}
      onStartSetup={() => {
        startTransition(() => {
          router.push("/new");
        });
      }}
    />
  );
}

export default memo(DashboardCompanionList);
