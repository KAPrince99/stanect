import Link from "next/link";
import { memo } from "react";

import { Button } from "@/components/ui/button";

interface CompanionOverviewCardActionProps {
  cardHref: string;
  enableNavigation: boolean;
}

function CompanionOverviewCardAction({
  cardHref,
  enableNavigation,
}: CompanionOverviewCardActionProps) {
  const buttonContent = (
    <Button
      size="lg"
      className="type-cta h-9 w-full bg-linear-to-r from-amber-400 to-orange-500 text-sm text-black shadow-lg hover:from-amber-500 hover:to-orange-600 md:h-10"
      disabled={!enableNavigation}
    >
      Start Convo
    </Button>
  );

  return enableNavigation ? (
    <Link href={cardHref} className="block">
      {buttonContent}
    </Link>
  ) : (
    buttonContent
  );
}

export default memo(CompanionOverviewCardAction);
