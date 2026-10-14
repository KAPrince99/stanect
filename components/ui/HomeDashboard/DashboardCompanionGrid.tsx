"use client";

import { AnimatePresence, motion } from "framer-motion";
import { memo } from "react";

import { motionTransition, motionVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { CompanionProps } from "@/types/types";

import CompanionGhostCard from "./CompanionGhostCard";
import CompanionOverviewCard from "./CompanionOverviewCard";
import { DASHBOARD_CARD_GRID } from "./dashboard-layout";

/** Fill the first row visually until the user has a full set of companions. */
export const TARGET_SLOT_COUNT = 3;

interface DashboardCompanionGridProps {
  companions: CompanionProps[];
  showGhosts?: boolean;
  favoriteIds?: ReadonlySet<string>;
  onToggleFavorite?: (id: string) => void;
}

/** First ghost completes a 2-column row. Later ghosts only appear in the 3-column row. */
function ghostLayoutClass(companionCount: number, index: number) {
  const fillsNarrowRow = companionCount % 2 === 1 && index === 0;
  return fillsNarrowRow
    ? "flex h-full flex-col"
    : "hidden h-full lg:flex lg:flex-col";
}

function DashboardCompanionGrid({
  companions,
  showGhosts = true,
  favoriteIds,
  onToggleFavorite,
}: DashboardCompanionGridProps) {
  const ghostCount = showGhosts
    ? Math.max(0, TARGET_SLOT_COUNT - companions.length)
    : 0;

  return (
    <motion.div className={DASHBOARD_CARD_GRID}>
      <AnimatePresence initial={false} mode="popLayout">
        {companions.map((companion) => (
          <motion.div
            key={companion.id}
            className="flex h-full min-w-0 flex-col"
            variants={motionVariants.cardPop}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={motionTransition.soft}
          >
            <CompanionOverviewCard
              companion={companion}
              isFavorite={favoriteIds?.has(companion.id)}
              onToggleFavorite={
                onToggleFavorite
                  ? () => onToggleFavorite(companion.id)
                  : undefined
              }
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {Array.from({ length: ghostCount }).map((_, index) => (
        <CompanionGhostCard
          key={`ghost-${index}`}
          index={index}
          className={cn("min-w-0", ghostLayoutClass(companions.length, index))}
        />
      ))}
    </motion.div>
  );
}

export default memo(DashboardCompanionGrid);
