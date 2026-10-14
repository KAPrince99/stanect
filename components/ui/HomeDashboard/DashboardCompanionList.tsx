"use client";

import { useQuery } from "@tanstack/react-query";
import {
  memo,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";

import { getCompanions, getUser } from "@/app/(app)/actions/actions";
import {
  getFavoriteCompanionIds,
  subscribeToFavoriteCompanions,
  toggleFavoriteCompanion,
} from "@/lib/companion-favorites";
import {
  applyCompanionFilters,
  SEARCH_DEBOUNCE_MS,
  type CompanionFilter,
} from "@/lib/companion-search";
import { getLastCompanionId } from "@/lib/last-companion";
import { hasReachedCompanionLimit } from "@/lib/plan-utils";
import type { PlanType } from "@/lib/plan-limits";
import type { CompanionProps } from "@/types/types";

import DashboardCompanionsView from "./DashboardCompanionsView";

interface DashboardCompanionListProps {
  userId: string;
}

const EMPTY_FAVORITE_IDS: string[] = [];

function pickContinueCompanion(
  companions: CompanionProps[],
  lastId: string | null,
) {
  if (companions.length === 0) return null;

  if (lastId) {
    const match = companions.find((companion) => companion.id === lastId);
    if (match) return match;
  }

  return companions[0];
}

function subscribeToLastCompanionId(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function DashboardCompanionList({ userId }: DashboardCompanionListProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [companionFilter, setCompanionFilter] =
    useState<CompanionFilter>("all");
  const favoriteIds = useSyncExternalStore(
    subscribeToFavoriteCompanions,
    getFavoriteCompanionIds,
    () => EMPTY_FAVORITE_IDS,
  );
  const [isStartingSetup, startTransition] = useTransition();
  const lastCompanionId = useSyncExternalStore(
    subscribeToLastCompanionId,
    getLastCompanionId,
    () => null,
  );

  useEffect(() => {
    if (!searchQuery.trim()) {
      setActiveQuery("");
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveQuery(searchQuery);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const { data: companions = [], isLoading: isCompanionsLoading } = useQuery({
    queryKey: ["companions", userId],
    queryFn: () => getCompanions(),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  const { data: userData } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  const continueCompanion = useMemo(
    () => pickContinueCompanion(companions, lastCompanionId),
    [companions, lastCompanionId],
  );

  const favoriteIdSet = useMemo(
    () => new Set(favoriteIds),
    [favoriteIds],
  );

  const filteredCompanions = useMemo(
    () =>
      applyCompanionFilters(
        companions,
        activeQuery,
        companionFilter,
        favoriteIdSet,
      ),
    [companions, activeQuery, companionFilter, favoriteIdSet],
  );

  const canCreateCompanion = useMemo(() => {
    const plan = (userData?.plan || "free").toString().toLowerCase();
    const planKey = (
      plan === "pro" || plan === "king" ? plan : "free"
    ) as PlanType;
    return !hasReachedCompanionLimit(companions.length, planKey);
  }, [companions.length, userData?.plan]);

  return (
    <DashboardCompanionsView
      companions={companions}
      filteredCompanions={filteredCompanions}
      searchQuery={searchQuery}
      activeQuery={activeQuery}
      onSearchQueryChange={setSearchQuery}
      companionFilter={companionFilter}
      onCompanionFilterChange={setCompanionFilter}
      favoriteIds={favoriteIdSet}
      onToggleFavorite={toggleFavoriteCompanion}
      continueCompanion={continueCompanion}
      canCreateCompanion={canCreateCompanion}
      isLoading={isCompanionsLoading}
      isStartingSetup={isStartingSetup}
      onStartSetup={() => {
        startTransition(() => {
          router.push("/new");
        });
      }}
    />
  );
}

export default memo(DashboardCompanionList);
