import React, { memo } from "react";
import { Button } from "../button";

interface PreviewEditStepsProps {
  onEditStep?: (index: number) => void;
}

function PreviewEditSteps({ onEditStep }: PreviewEditStepsProps) {
  return (
    <div className="type-label space-y-5">
      <div className="flex items-center justify-between">
        <span>Avatar</span>
        <Button
          variant="ghost"
          className="type-meta h-auto p-0 text-amber-300 hover:text-amber-200"
          onClick={() => onEditStep?.(0)}
        >
          Edit
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <span>Name & Scene</span>
        <Button
          variant="ghost"
          className="type-meta h-auto p-0 text-amber-300 hover:text-amber-200"
          onClick={() => onEditStep?.(1)}
        >
          Edit
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <span>Voice & Duration</span>
        <Button
          variant="ghost"
          className="type-meta h-auto p-0 text-amber-300 hover:text-amber-200"
          onClick={() => onEditStep?.(2)}
        >
          Edit
        </Button>
      </div>
    </div>
  );
}

export default memo(PreviewEditSteps);
