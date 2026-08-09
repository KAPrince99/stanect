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
    <section className="relative px-4 pt-24 pb-8 sm:px-6 lg:pt-28">
      <div className="mx-auto w-full max-w-4xl">
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
      </div>
    </section>
  );
}

export default memo(DashboardCompanionsView);
