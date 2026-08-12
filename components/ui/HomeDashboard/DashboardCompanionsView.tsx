"use client";

import { memo } from "react";

import type { UsageTone } from "@/lib/practice-usage";
import type { CompanionProps } from "@/types/types";

import { DashboardRouteLoading } from "../AppRouteLoading";
import DashboardCompanionGrid, {
  TARGET_SLOT_COUNT,
} from "./DashboardCompanionGrid";
import DashboardContinueStrip from "./DashboardContinueStrip";
import EmptyCompanionState from "./EmptyCompanionState";

interface DashboardCompanionsViewProps {
  companions: CompanionProps[];
  welcomeUser: string;
  continueCompanion: CompanionProps | null;
  canCreateCompanion: boolean;
  planBadgeLabel: string;
  planBadgeTone: UsageTone;
  isLoading: boolean;
  onStartSetup: () => void;
  isStartingSetup?: boolean;
}

function DashboardCompanionsView({
  companions,
  welcomeUser,
  continueCompanion,
  canCreateCompanion,
  planBadgeLabel,
  planBadgeTone,
  isLoading,
  onStartSetup,
  isStartingSetup = false,
}: DashboardCompanionsViewProps) {
  if (isLoading) {
    return <DashboardRouteLoading />;
  }

  const hasCompanions = companions.length > 0;
  const showCreate =
    canCreateCompanion && companions.length >= TARGET_SLOT_COUNT;

  return (
    <section className="relative px-4 pt-24 pb-8 sm:px-6 lg:pt-28">
      <div className="mx-auto w-full max-w-4xl">
        {hasCompanions && continueCompanion ? (
          <>
            <DashboardContinueStrip
              welcomeName={welcomeUser}
              companionName={continueCompanion.companion_name}
              scene={continueCompanion.scene || ""}
              durationLabel={`${continueCompanion.duration} min session`}
              avatarUrl={continueCompanion.avatars.image_url}
              continueHref={`/dashboard/${continueCompanion.id}`}
              showCreate={showCreate}
              planBadgeLabel={planBadgeLabel}
              planBadgeTone={planBadgeTone}
            />
            <DashboardCompanionGrid companions={companions} />
          </>
        ) : (
          <EmptyCompanionState
            onStartSetup={onStartSetup}
            isPending={isStartingSetup}
          />
        )}
      </div>
    </section>
  );
}

export default memo(DashboardCompanionsView);
