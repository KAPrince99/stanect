import React, { memo } from "react";
import { CompanionProps } from "@/types/types";

interface PreviewSummaryProps {
  companion: CompanionProps;
}

function PreviewSummary({ companion }: PreviewSummaryProps) {
  return (
    <div className="space-y-2 rounded-xl bg-white/5 border border-white/10 p-4 text-sm text-white/80">
      <div className="flex items-center justify-between">
        <span>Name</span>
        <span className="text-white">{companion.companion_name}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Voice</span>
        <span className="text-white capitalize">{companion.voice}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Duration</span>
        <span className="text-white">{companion.duration} min</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span>Scene</span>
        <span className="text-white text-right truncate max-w-[200px]">
          {companion.scene}
        </span>
      </div>
    </div>
  );
}

export default memo(PreviewSummary);
