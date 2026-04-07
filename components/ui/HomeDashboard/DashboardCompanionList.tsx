"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { memo, useMemo } from "react";

import { getCompanions } from "@/app/(app)/actions/actions";

import DashboardCompanionsView from "./DashboardCompanionsView";

interface DashboardCompanionListProps {
  userId: string;
}

function DashboardCompanionList({ userId }: DashboardCompanionListProps) {
  const { user, isLoaded: userLoaded } = useUser();

  const { data: companions = [], isLoading } = useQuery({
    queryKey: ["companions", userId],
    queryFn: () => getCompanions(userId),
    enabled: !!userId && userLoaded,
    staleTime: 1000 * 60 * 5,
  });

  const welcomeUser = useMemo(
    () => user?.firstName || "King",
    [user?.firstName],
  );

  return (
    <DashboardCompanionsView
      companions={companions}
      welcomeUser={welcomeUser}
      userLoaded={userLoaded}
      isLoading={isLoading}
    />
  );
}

export default memo(DashboardCompanionList);
