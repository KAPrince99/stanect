import { memo } from "react";

import CompanionOverviewCardAction from "./CompanionOverviewCardAction";

interface CompanionOverviewCardContentProps {
  cardHref: string;
  companionName: string;
  showConvoButton: boolean;
  enableNavigation: boolean;
}

function CompanionOverviewCardContent({
  cardHref,
  companionName,
  showConvoButton,
  enableNavigation,
}: CompanionOverviewCardContentProps) {
  return (
    <div className="flex flex-1 flex-col p-3 text-center sm:p-4">
      <h3 className="type-title line-clamp-2 text-base leading-tight wrap-break-word sm:text-lg">
        {companionName}
      </h3>

      {showConvoButton ? (
        <div className="mt-auto pt-2.5">
          <CompanionOverviewCardAction
            cardHref={cardHref}
            enableNavigation={enableNavigation}
          />
        </div>
      ) : null}
    </div>
  );
}

export default memo(CompanionOverviewCardContent);
