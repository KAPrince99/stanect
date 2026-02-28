"use client";

import { useQuery } from "@tanstack/react-query";
import { getCompanions } from "@/app/(app)/actions/actions";
import { useUser } from "@clerk/nextjs";
import { memo, useMemo } from "react";
import CompanionListPresenter from "./CompanionListPresenter";

function CompanionList({ userId }: { userId: string }) {
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
    <CompanionListPresenter
      companions={companions}
      welcomeUser={welcomeUser}
      userLoaded={userLoaded}
      isLoading={isLoading}
    />
  );
}

export default memo(CompanionList);
