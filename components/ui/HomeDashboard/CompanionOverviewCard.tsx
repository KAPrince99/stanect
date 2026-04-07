import Link from "next/link";
import { motion } from "framer-motion";
import { memo } from "react";
import { CompanionProps } from "@/types/types";
import CompanionOverviewCardContent from "./CompanionOverviewCardContent";
import CompanionOverviewCardMedia from "./CompanionOverviewCardMedia";

interface CompanionOverviewCardProps {
  companion: CompanionProps;
  showConvoButton?: boolean;
  enableNavigation?: boolean;
  enableHoverLift?: boolean;
}

function CompanionOverviewCard({
  companion,
  showConvoButton = true,
  enableNavigation = true,
  enableHoverLift = true,
}: CompanionOverviewCardProps) {
  const cardHref = `/dashboard/${companion.id}`;
  const mediaContent = <CompanionOverviewCardMedia companion={companion} />;

  return (
    <motion.article
      whileHover={enableHoverLift ? { y: -6 } : undefined}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl"
      style={{ willChange: "transform" }}
    >
      {enableNavigation ? (
        <Link href={cardHref}>{mediaContent}</Link>
      ) : (
        mediaContent
      )}

      <CompanionOverviewCardContent
        cardHref={cardHref}
        companionName={companion.companion_name}
        showConvoButton={showConvoButton}
        enableNavigation={enableNavigation}
      />
    </motion.article>
  );
}

export default memo(CompanionOverviewCard);
