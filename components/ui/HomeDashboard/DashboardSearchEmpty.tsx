"use client";

import { memo } from "react";

import { Button } from "../button";

interface DashboardSearchEmptyProps {
  query: string;
  onClear: () => void;
}

function DashboardSearchEmpty({ query, onClear }: DashboardSearchEmptyProps) {
  const label = query.trim();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center backdrop-blur-xl">
      <h2 className="type-title">
        {label ? `No companions match “${label}”` : "No companions match"}
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
