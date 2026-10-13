"use client";

import { Search, X } from "lucide-react";
import { memo, useEffect, useRef } from "react";

import { Button } from "../button";

interface DashboardSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  matchCount: number;
  totalCount: number;
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

function DashboardSearch({
  query,
  onQueryChange,
  matchCount,
  totalCount,
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
    <div className="mb-4 sm:mb-5">
      <form
        role="search"
        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-xl sm:px-4"
        onSubmit={(event) => event.preventDefault()}
      >
        <Search className="size-4 shrink-0 text-white/40" aria-hidden />
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
          className="type-body min-w-0 flex-1 border-0 bg-transparent text-white shadow-none placeholder:text-white/40 !outline-none ring-0 focus:border-0 focus:!outline-none focus:ring-0 focus-visible:!outline-none focus-visible:ring-0"
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

      {isSearching ? (
        <p className="type-meta mt-2" aria-live="polite">
          {matchCount} of {totalCount}
        </p>
      ) : null}
    </div>
  );
}

export default memo(DashboardSearch);
