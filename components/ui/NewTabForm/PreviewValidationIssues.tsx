import React, { memo } from "react";

interface PreviewValidationIssuesProps {
  issues: string[];
}

function PreviewValidationIssues({ issues }: PreviewValidationIssuesProps) {
  if (issues.length === 0) return null;

  return (
    <div className="rounded-lg border border-red-300/40 bg-red-500/10 p-3">
      <p className="type-label text-red-200">
        A few details still need attention:
      </p>
      <ul className="type-meta mt-2 list-disc space-y-1 pl-4 text-red-100">
        {issues.map((issue) => (
          <li key={issue}>{issue}</li>
        ))}
      </ul>
    </div>
  );
}

export default memo(PreviewValidationIssues);
