import Link from "next/link";
import { memo } from "react";

import { Button } from "@/components/ui/button";

import LordIcon from "../lordIcon";

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
      className="h-10 w-full bg-linear-to-r from-amber-400 to-orange-500 text-md font-display text-black shadow-lg hover:from-amber-500 hover:to-orange-600 md:h-12"
      disabled={!enableNavigation}
    >
      <LordIcon
        src="https://cdn.lordicon.com/ckooqaow.json"
        trigger={enableNavigation ? "hover" : "loop"}
        colors="primary:#000000,secondary:#000000,tertiary:#000000,quaternary:#000000,quinary:#000000"
        height={20}
        width={20}
      />
      Convo
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
