"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  getCompanions,
  getUser,
  importFavoriteCompanions,
  toggleFavoriteCompanion,
} from "@/app/(app)/actions/actions";
import {
  clearLocalFavoriteCompanionIds,
  getLocalFavoriteCompanionIds,
} from "@/lib/companion-favorites";
import {
  applyCompanionFilters,
  SEARCH_DEBOUNCE_MS,
  type CompanionFilter,
} from "@/lib/companion-search";
import { getLastCompanionId } from "@/lib/last-companion";
import { hasReachedCompanionLimit } from "@/lib/plan-utils";
import type { PlanType } from "@/lib/plan-limits";
import type { CompanionProps, Userprops } from "@/types/types";

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
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [companionFilter, setCompanionFilter] =
    useState<CompanionFilter>("all");
  const importedLocalFavorites = useRef(false);
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

  const favoriteIds = userData?.favorite_companion_ids ?? EMPTY_FAVORITE_IDS;

  useEffect(() => {
    if (!userData || importedLocalFavorites.current) return;
    const localIds = getLocalFavoriteCompanionIds();
    if (localIds.length === 0) return;

    const alreadyOnUser = new Set(userData.favorite_companion_ids ?? []);
    if (localIds.every((id) => alreadyOnUser.has(id))) {
      clearLocalFavoriteCompanionIds();
      importedLocalFavorites.current = true;
      return;
    }

    importedLocalFavorites.current = true;
    void importFavoriteCompanions(localIds)
      .then((result) => {
        clearLocalFavoriteCompanionIds();
        queryClient.setQueryData(
          ["users", userId],
          (current: Userprops | null | undefined) =>
            current
              ? {
                  ...current,
                  favorite_companion_ids: result.favorite_companion_ids,
                }
              : current,
        );
      })
      .catch(() => {
        importedLocalFavorites.current = false;
      });
  }, [queryClient, userData, userId]);

  const favoriteMutation = useMutation({
    mutationFn: (companionId: string) => toggleFavoriteCompanion(companionId),
    onMutate: async (companionId) => {
      await queryClient.cancelQueries({ queryKey: ["users", userId] });
      const previous = queryClient.getQueryData<Userprops>(["users", userId]);
      queryClient.setQueryData(
        ["users", userId],
        (current: Userprops | null | undefined) => {
          if (!current) return current;
          const next = new Set(current.favorite_companion_ids ?? []);
          if (next.has(companionId)) next.delete(companionId);
          else next.add(companionId);
          return { ...current, favorite_companion_ids: [...next] };
        },
      );
      return { previous };
    },
    onError: (error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["users", userId], context.previous);
      }
      toast.error(
        error instanceof Error ? error.message : "Could not update favorite",
      );
    },
    onSuccess: (result) => {
      queryClient.setQueryData(
        ["users", userId],
        (current: Userprops | null | undefined) =>
          current
            ? { ...current, favorite_companion_ids: result.favorite_companion_ids }
            : current,
      );
    },
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
      onToggleFavorite={(id) => favoriteMutation.mutate(id)}
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
