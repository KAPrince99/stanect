"use client";

import { useQuery } from "@tanstack/react-query";
import { type ReactNode } from "react";

import { fetchUserNecessities } from "@/app/(app)/actions/actions";
import { canUserCall } from "@/lib/plan-utils";

import LoadingSpinner from "../LoadingSpinner";
import ConvoGuard from "../convoGuard";

interface ConvoAccessGateProps {
  userId: string;
  children: ReactNode;
}

function ConvoAccessGate({ userId, children }: ConvoAccessGateProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userNecessities", userId],
    queryFn: () => fetchUserNecessities(),
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
  const access = canUserCall({
    plan,
    created_at: data?.created_at,
    daily_seconds_used: data?.daily_seconds_used,
  });

  if (!access.allowed) {
    const reason =
      access.reason === "TRIAL_EXPIRED"
        ? "trial_expired"
        : "daily_limit_reached";

    return (
      <div className="min-h-screen bg-transparent px-6 py-16">
        <ConvoGuard reason={reason} plan={plan} />
      </div>
    );
  }

  return children;
}

export default ConvoAccessGate;
