"use client";

import { memo } from "react";

import { CompanionProps } from "@/types/types";

import LoadingSpinner from "../LoadingSpinner";
import DashboardCompanionGrid from "./DashboardCompanionGrid";
import DashboardWelcomeHeader from "./DashboardWelcomeHeader";
import EmptyCompanionState from "./EmptyCompanionState";

interface DashboardCompanionsViewProps {
  companions: CompanionProps[];
  welcomeUser: string;
  userLoaded: boolean;
  isLoading: boolean;
}

function DashboardCompanionsView({
  companions,
  welcomeUser,
  userLoaded,
  isLoading,
}: DashboardCompanionsViewProps) {
  if (!userLoaded || isLoading) {
    return <LoadingSpinner />;
  }

  const hasCompanions = companions.length > 0;

  return (
    <section className="relative px-6 py-25 md:px-10 lg:px-16">
      <DashboardWelcomeHeader
        welcomeUser={welcomeUser}
        hasCompanions={hasCompanions}
        companionCount={companions.length}
      />

      {hasCompanions ? (
        <DashboardCompanionGrid companions={companions} />
      ) : (
        <EmptyCompanionState />
      )}
    </section>
  );
}

export default memo(DashboardCompanionsView);
