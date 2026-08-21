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
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["userNecessities", userId],
    queryFn: () => fetchUserNecessities(),
    enabled: !!userId,
    staleTime: 1000 * 60,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="flex h-full min-h-0 flex-1 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Fail closed: never open the call stage if we can't verify plan / limits.
  if (isError || !data) {
    return (
      <div className="flex h-full min-h-0 flex-1 flex-col">
        <ConvoGuard
          reason="check_failed"
          onRetry={() => {
            void refetch();
          }}
          isRetrying={isFetching}
        />
      </div>
    );
  }

  const plan = data.plan || "free";
  const access = canUserCall({
    plan,
    created_at: data.created_at,
    daily_seconds_used: data.daily_seconds_used,
    last_usage_date: data.last_usage_date,
  });

  if (!access.allowed) {
    const reason =
      access.reason === "TRIAL_EXPIRED"
        ? "trial_expired"
        : "daily_limit_reached";

    return (
      <div className="flex h-full min-h-0 flex-1 flex-col">
        <ConvoGuard reason={reason} plan={plan} />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">{children}</div>
  );
}

export default ConvoAccessGate;
