"use client";

import { memo } from "react";

import type { CompanionFilter } from "@/lib/companion-search";
import type { CompanionProps } from "@/types/types";

import { DashboardRouteLoading } from "../AppRouteLoading";
import DashboardCompanionGrid from "./DashboardCompanionGrid";
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
  companionFilter?: CompanionFilter;
  onCompanionFilterChange?: (filter: CompanionFilter) => void;
  favoriteIds?: ReadonlySet<string>;
  onToggleFavorite?: (id: string) => void;
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
  companionFilter = "all",
  onCompanionFilterChange,
  favoriteIds,
  onToggleFavorite,
  continueCompanion = null,
  isLoading,
  onStartSetup,
  isStartingSetup = false,
}: DashboardCompanionsViewProps) {
  if (isLoading) {
    return <DashboardRouteLoading />;
  }

  const hasCompanions = companions.length > 0;
  const isSearching = activeQuery.trim().length > 0;
  const isFilteringFavorites = companionFilter === "favorites";
  const showSearch = hasCompanions && Boolean(onSearchQueryChange);
  const showCreate = hasCompanions;
  const showEmptyResults =
    filteredCompanions.length === 0 && (isSearching || isFilteringFavorites);

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
                totalCount={
                  isFilteringFavorites
                    ? companions.filter((companion) =>
                        favoriteIds?.has(companion.id),
                      ).length
                    : companions.length
                }
                companionFilter={companionFilter}
                onCompanionFilterChange={onCompanionFilterChange ?? (() => {})}
              />
            ) : null}
            {showEmptyResults ? (
              <DashboardSearchEmpty
                query={activeQuery}
                filter={companionFilter}
                onClear={() => {
                  if (isSearching) {
                    onSearchQueryChange?.("");
                    return;
                  }
                  onCompanionFilterChange?.("all");
                }}
              />
            ) : (
              <DashboardCompanionGrid
                companions={filteredCompanions}
                showGhosts={!isSearching && !isFilteringFavorites}
                favoriteIds={favoriteIds}
                onToggleFavorite={onToggleFavorite}
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
