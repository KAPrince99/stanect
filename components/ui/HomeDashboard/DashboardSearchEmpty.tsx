"use client";

import { memo } from "react";

import type { CompanionFilter } from "@/lib/companion-search";

import { Button } from "../button";

interface DashboardSearchEmptyProps {
  query: string;
  filter?: CompanionFilter;
  onClear: () => void;
}

function DashboardSearchEmpty({
  query,
  filter = "all",
  onClear,
}: DashboardSearchEmptyProps) {
  const label = query.trim();
  const isFavorites = filter === "favorites";

  if (isFavorites && !label) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center backdrop-blur-xl">
        <h2 className="type-title">No favorites yet</h2>
        <p className="type-body mx-auto mt-2 max-w-md">
          Star a companion from All to see it here.
        </p>
        <Button
          type="button"
          variant="secondary"
          size="md"
          className="mt-6"
          onClick={onClear}
        >
          Show all
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center backdrop-blur-xl">
      <h2 className="type-title">
        {isFavorites
          ? `No favorites match “${label}”`
          : `No companions match “${label}”`}
      </h2>
      <p className="type-body mx-auto mt-2 max-w-md">
        Try a different name or scene.
      </p>
      <Button
        type="button"
        variant="secondary"
        size="md"
        className="mt-6"
        onClick={onClear}
      >
        Clear
      </Button>
    </div>
  );
}

export default memo(DashboardSearchEmpty);
