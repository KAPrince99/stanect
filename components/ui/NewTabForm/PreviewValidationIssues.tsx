import React, { memo } from "react";

interface PreviewValidationIssuesProps {
  issues: string[];
}

function PreviewValidationIssues({ issues }: PreviewValidationIssuesProps) {
  if (issues.length === 0) return null;

  return (
    <div className="rounded-lg border border-red-300/40 bg-red-500/10 p-3">
      <p className="text-sm text-red-200 font-medium">
        A few details still need attention:
      </p>
      <ul className="mt-2 text-xs text-red-100 list-disc pl-4 space-y-1">
        {issues.map((issue) => (
          <li key={issue}>{issue}</li>
        ))}
      </ul>
    </div>
  );
}

export default memo(PreviewValidationIssues);
