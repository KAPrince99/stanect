"use client";

import { useQuery } from "@tanstack/react-query";
import { type ReactNode } from "react";

import { fetchUserNecessities } from "@/app/(app)/actions/actions";
import { isTrialExpired } from "@/lib/plan-utils";

import LoadingSpinner from "../LoadingSpinner";
import ConvoGuard from "../convoGuard";

interface ConvoAccessGateProps {
  userId: string;
  children: ReactNode;
}

function ConvoAccessGate({ userId, children }: ConvoAccessGateProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userNecessities", userId],
    queryFn: () => fetchUserNecessities(userId),
    enabled: !!userId,
    staleTime: 1000 * 60,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return children;
  }

  const plan = data?.plan || "free";

  if (plan === "free") {
    if (isTrialExpired(data?.created_at ?? "")) {
      return (
        <div className="min-h-screen bg-transparent px-6 py-16">
          <ConvoGuard reason="trial_expired" plan={plan} />
        </div>
      );
    }

    if ((data?.daily_seconds_used || 0) >= 360) {
      return (
        <div className="min-h-screen bg-transparent px-6 py-16">
          <ConvoGuard reason="daily_limit_reached" plan={plan} />
        </div>
      );
    }
  }

  return children;
}

export default ConvoAccessGate;
