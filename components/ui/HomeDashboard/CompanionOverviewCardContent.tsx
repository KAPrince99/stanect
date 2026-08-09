import { memo } from "react";

import CompanionOverviewCardAction from "./CompanionOverviewCardAction";

interface CompanionOverviewCardContentProps {
  cardHref: string;
  companionName: string;
  scene?: string;
  showConvoButton: boolean;
  enableNavigation: boolean;
}

function CompanionOverviewCardContent({
  cardHref,
  companionName,
  scene,
  showConvoButton,
  enableNavigation,
}: CompanionOverviewCardContentProps) {
  return (
    <div className="space-y-2.5 p-3.5 text-center sm:p-4">
      <div className="space-y-1">
        <h3 className="type-title text-base sm:text-lg">
          {companionName}
        </h3>
        {scene ? (
          <p className="type-meta capitalize sm:hidden">{scene}</p>
        ) : null}
      </div>

      {showConvoButton ? (
        <CompanionOverviewCardAction
          cardHref={cardHref}
          enableNavigation={enableNavigation}
        />
      ) : null}
    </div>
  );
}

export default memo(CompanionOverviewCardContent);
