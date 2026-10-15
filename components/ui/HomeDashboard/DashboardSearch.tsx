"use client";

import { X } from "lucide-react";
import {
  memo,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";

import type { CompanionFilter } from "@/lib/companion-search";
import { cn } from "@/lib/utils";

import { Button } from "../button";
import {
  DASHBOARD_BELOW_SEARCH,
  DASHBOARD_ONE_CARD_WIDTH,
  DASHBOARD_RESULTS_ID,
  DASHBOARD_SEARCH_PAD_X,
} from "./dashboard-layout";

interface DashboardSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  companionFilter: CompanionFilter;
  onCompanionFilterChange: (filter: CompanionFilter) => void;
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

function nextFilter(
  current: CompanionFilter,
  key: string,
): CompanionFilter | null {
  if (key === "ArrowRight" || key === "ArrowDown") {
    return current === "all" ? "favorites" : "all";
  }
  if (key === "ArrowLeft" || key === "ArrowUp") {
    return current === "favorites" ? "all" : "favorites";
  }
  if (key === "Home") return "all";
  if (key === "End") return "favorites";
  return null;
}

function FilterOption({
  label,
  selected,
  onSelect,
  buttonRef,
  children,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
  buttonRef: Ref<HTMLButtonElement>;
  children?: ReactNode;
}) {
  return (
    // eslint-disable-next-line no-restricted-syntax -- segmented All/Favorites radios
    <button
      ref={buttonRef}
      type="button"
      role="radio"
      aria-label={label}
      aria-checked={selected}
      tabIndex={selected ? 0 : -1}
      onClick={onSelect}
      className={cn(
        "relative z-10 flex h-full min-h-11 w-full items-center justify-center rounded-xl px-2.5 text-sm font-semibold whitespace-nowrap transition-colors duration-300 sm:px-3",
        selected ? "text-white" : "text-white/50 hover:text-white/80",
      )}
    >
      {children ?? label}
    </button>
  );
}

function DashboardSearch({
  query,
  onQueryChange,
  companionFilter,
  onCompanionFilterChange,
}: DashboardSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const allRef = useRef<HTMLButtonElement>(null);
  const favoritesRef = useRef<HTMLButtonElement>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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

  function onFilterKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const next = nextFilter(companionFilter, event.key);
    if (!next) return;

    event.preventDefault();
    onCompanionFilterChange(next);
    (next === "all" ? allRef : favoritesRef).current?.focus();
  }

  return (
    <div className={DASHBOARD_BELOW_SEARCH}>
      <div
        className={cn(
          "flex w-full min-w-0 items-stretch rounded-3xl border border-white/20 bg-white/5 backdrop-blur-xl",
          isSearchFocused && "animate-search-border",
        )}
      >
        <form
          role="search"
          className={cn(
            "flex min-w-0 flex-1 items-center gap-2.5 py-3",
            DASHBOARD_SEARCH_PAD_X,
          )}
          onSubmit={(event) => event.preventDefault()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- local SVG; next/image does not optimize it */}
          <img
            src="/icons/search-magnifier.svg"
            alt=""
            width={24}
            height={24}
            aria-hidden
            className={cn(
              "size-6 shrink-0",
              isSearchFocused && "animate-search-look",
            )}
          />
          <input
            ref={inputRef}
            type="text"
            inputMode="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            value={query}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
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
          aria-controls={DASHBOARD_RESULTS_ID}
          onKeyDown={onFilterKeyDown}
          className={cn(
            "relative m-1.5 grid min-h-11 grid-cols-2 items-stretch rounded-2xl border border-white/20",
            DASHBOARD_ONE_CARD_WIDTH,
          )}
        >
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-y-0.5 left-0.5 w-[calc(50%-0.125rem)] rounded-xl bg-white/15 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              companionFilter === "favorites" && "translate-x-full",
            )}
          />
          <FilterOption
            label="All"
            selected={companionFilter === "all"}
            onSelect={() => onCompanionFilterChange("all")}
            buttonRef={allRef}
          />
          <FilterOption
            label="Favorites"
            selected={companionFilter === "favorites"}
            onSelect={() => onCompanionFilterChange("favorites")}
            buttonRef={favoritesRef}
          >
            <span className="sm:hidden">Favs</span>
            <span className="hidden sm:inline">Favorites</span>
          </FilterOption>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {companionFilter === "favorites" ? "Showing favorites" : "Showing all"}
      </p>
    </div>
  );
}

export default memo(DashboardSearch);
