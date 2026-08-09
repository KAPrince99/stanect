"use client";

import { useQuery } from "@tanstack/react-query";

import { getCreateCompanionGate } from "@/app/(app)/actions/actions";
import { getMaxCompanions, hasReachedCompanionLimit } from "@/lib/plan-utils";

import { NewCompanionRouteLoading } from "../AppRouteLoading";
import UpgradeAlert from "../upgradeAlert";
import TabForm from "./TabForm";

interface NewCompanionGateProps {
  userId: string;
}

export default function NewCompanionGate({ userId }: NewCompanionGateProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["createCompanionGate", userId],
    queryFn: () => getCreateCompanionGate(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading && !data) {
    return <NewCompanionRouteLoading />;
  }

  if (isError || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6 text-white/70">
        Unable to verify your plan right now. Please try again.
      </main>
    );
  }

  const maxAllowed = getMaxCompanions(data.plan);

  if (hasReachedCompanionLimit(data.count, data.plan)) {
    return <UpgradeAlert plan={data.plan} maxAllowed={maxAllowed} />;
  }

  return (
    <main className="flex min-h-screen flex-col bg-transparent pt-24 pb-28 lg:pb-16">
      <TabForm userPlan={data.plan} />
    </main>
  );
}
