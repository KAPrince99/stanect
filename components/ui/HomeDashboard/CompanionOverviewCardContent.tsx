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
    <div className="p-5 text-center">
      <h3 className="mb-3 text-xl text-white md:text-2xl">{companionName}</h3>

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
