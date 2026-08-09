"use client";

import { memo } from "react";

import { CompanionProps } from "@/types/types";

import { DashboardRouteLoading } from "../AppRouteLoading";
import DashboardCompanionGrid from "./DashboardCompanionGrid";
import DashboardWelcomeHeader from "./DashboardWelcomeHeader";
import EmptyCompanionState from "./EmptyCompanionState";

interface DashboardCompanionsViewProps {
  companions: CompanionProps[];
  welcomeUser: string;
  isLoading: boolean;
}

function DashboardCompanionsView({
  companions,
  welcomeUser,
  isLoading,
}: DashboardCompanionsViewProps) {
  if (isLoading) {
    return <DashboardRouteLoading />;
  }

  const hasCompanions = companions.length > 0;

  return (
    <section className="relative px-4 pt-24 pb-8 sm:px-6 md:px-10 lg:px-12 lg:pt-28">
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
