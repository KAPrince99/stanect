"use client";

import { memo } from "react";

import type { CompanionProps } from "@/types/types";

import { DashboardRouteLoading } from "../AppRouteLoading";
import DashboardCompanionGrid, {
  TARGET_SLOT_COUNT,
} from "./DashboardCompanionGrid";
import DashboardContinueStrip from "./DashboardContinueStrip";
import DashboardSearch from "./DashboardSearch";
import DashboardSearchEmpty from "./DashboardSearchEmpty";
import EmptyCompanionState from "./EmptyCompanionState";

interface DashboardCompanionsViewProps {
  companions: CompanionProps[];
  filteredCompanions?: CompanionProps[];
  searchQuery?: string;
  activeQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  continueCompanion?: CompanionProps | null;
  canCreateCompanion?: boolean;
  isLoading: boolean;
  onStartSetup: () => void;
  isStartingSetup?: boolean;
}

function DashboardCompanionsView({
  companions,
  filteredCompanions = companions,
  searchQuery = "",
  activeQuery = searchQuery,
  onSearchQueryChange,
  continueCompanion = null,
  canCreateCompanion = false,
  isLoading,
  onStartSetup,
  isStartingSetup = false,
}: DashboardCompanionsViewProps) {
  if (isLoading) {
    return <DashboardRouteLoading />;
  }

  const hasCompanions = companions.length > 0;
  const isSearching = activeQuery.trim().length > 0;
  const showSearch = companions.length >= 2 && Boolean(onSearchQueryChange);
  const showCreate =
    canCreateCompanion && companions.length >= TARGET_SLOT_COUNT;

  return (
    <section className="app-column-x relative pt-24 pb-8 lg:pt-28">
      <div className="mx-auto w-full max-w-4xl">
        {hasCompanions ? (
          <>
            {continueCompanion ? (
              <DashboardContinueStrip
                companionName={continueCompanion.companion_name}
                avatarUrl={continueCompanion.avatars.image_url}
                continueHref={`/dashboard/${continueCompanion.id}`}
                showCreate={showCreate}
              />
            ) : null}
            {showSearch && onSearchQueryChange ? (
              <DashboardSearch
                query={searchQuery}
                onQueryChange={onSearchQueryChange}
                matchCount={filteredCompanions.length}
                totalCount={companions.length}
              />
            ) : null}
            {isSearching && filteredCompanions.length === 0 ? (
              <DashboardSearchEmpty
                query={activeQuery}
                onClear={() => onSearchQueryChange?.("")}
              />
            ) : (
              <DashboardCompanionGrid
                companions={filteredCompanions}
                showGhosts={!isSearching}
              />
            )}
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
