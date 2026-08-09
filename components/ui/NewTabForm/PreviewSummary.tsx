import React, { memo } from "react";
import { CompanionProps } from "@/types/types";

interface PreviewSummaryProps {
  companion: CompanionProps;
}

function PreviewSummary({ companion }: PreviewSummaryProps) {
  return (
    <div className="type-body space-y-2 rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
      <div className="flex items-center justify-between">
        <span className="type-meta">Name</span>
        <span className="type-label text-white">{companion.companion_name}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="type-meta">Voice</span>
        <span className="type-label capitalize text-white">{companion.voice}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="type-meta">Duration</span>
        <span className="type-label text-white">{companion.duration} min</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="type-meta">Scene</span>
        <span className="type-label max-w-[200px] truncate text-right text-white">
          {companion.scene}
        </span>
      </div>
    </div>
  );
}

export default memo(PreviewSummary);
