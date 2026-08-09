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
    <div className="space-y-3 p-4 text-center sm:p-5">
      <div className="space-y-1">
        <h3 className="font-display text-lg text-white sm:text-xl">
          {companionName}
        </h3>
        {scene ? (
          <p className="text-xs capitalize text-white/55 sm:hidden">{scene}</p>
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
