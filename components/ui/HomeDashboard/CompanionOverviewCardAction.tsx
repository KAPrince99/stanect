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
      variant="primary"
      size="md"
      className="w-full shadow-lg"
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
