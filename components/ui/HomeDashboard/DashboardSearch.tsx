"use client";

import { Search, X } from "lucide-react";
import { memo, useEffect, useRef } from "react";

import type { CompanionFilter } from "@/lib/companion-search";
import { cn } from "@/lib/utils";

import { Button } from "../button";
import {
  DASHBOARD_BELOW_SEARCH,
  DASHBOARD_CARD_GRID,
} from "./dashboard-layout";

interface DashboardSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  matchCount: number;
  totalCount: number;
  companionFilter: CompanionFilter;
  onCompanionFilterChange: (filter: CompanionFilter) => void;
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

function FilterOption({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    // eslint-disable-next-line no-restricted-syntax -- segmented All/Favorites radios
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "relative z-10 flex h-full w-full items-center justify-center rounded-xl px-4 text-base font-semibold whitespace-nowrap transition-colors duration-300",
        selected ? "text-white" : "text-white/50 hover:text-white/80",
      )}
    >
      {label}
    </button>
  );
}

function DashboardSearch({
  query,
  onQueryChange,
  matchCount,
  totalCount,
  companionFilter,
  onCompanionFilterChange,
}: DashboardSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isSearching = query.trim().length > 0;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      if (isTypingTarget(event.target)) return;

      event.preventDefault();
      inputRef.current?.focus();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className={DASHBOARD_BELOW_SEARCH}>
      <div className={cn(DASHBOARD_CARD_GRID, "items-stretch")}>
        <form
          role="search"
          className="col-span-2 flex min-w-0 items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl sm:px-5"
          onSubmit={(event) => event.preventDefault()}
        >
          <Search className="size-5 shrink-0 text-white/40" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            inputMode="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape" && query) {
                event.preventDefault();
                onQueryChange("");
              }
            }}
            placeholder="Search by name or scene"
            aria-label="Search companions"
            className="type-body min-w-0 flex-1 border-0 bg-transparent text-base text-white shadow-none placeholder:text-white/40 !outline-none ring-0 focus:border-0 focus:!outline-none focus:ring-0 focus-visible:!outline-none focus-visible:ring-0"
          />
          {query ? (
            <Button
              type="button"
              variant="glass"
              size="icon-sm"
              aria-label="Clear search"
              onClick={() => onQueryChange("")}
              className="size-8 text-white/50 hover:text-white"
            >
              <X className="size-4" />
            </Button>
          ) : null}
        </form>

        <div
          role="radiogroup"
          aria-label="Filter companions"
          className="relative grid min-h-12 w-full grid-cols-2 items-stretch rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-xl"
        >
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-y-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-xl bg-white/15 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              companionFilter === "favorites" && "translate-x-full",
            )}
          />
          <FilterOption
            label="All"
            selected={companionFilter === "all"}
            onSelect={() => onCompanionFilterChange("all")}
          />
          <FilterOption
            label="Favorites"
            selected={companionFilter === "favorites"}
            onSelect={() => onCompanionFilterChange("favorites")}
          />
        </div>
      </div>

      {isSearching ? (
        <p className="type-meta mt-2" aria-live="polite">
          {matchCount} of {totalCount}
        </p>
      ) : null}
    </div>
  );
}

export default memo(DashboardSearch);
