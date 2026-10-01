"use client";

import { AnimatePresence, motion } from "framer-motion";
import { memo } from "react";

import { motionTransition, motionVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { CompanionProps } from "@/types/types";

import CompanionGhostCard from "./CompanionGhostCard";
import CompanionOverviewCard from "./CompanionOverviewCard";

/** Fill the first row visually until the user has a full set of companions. */
export const TARGET_SLOT_COUNT = 3;

interface DashboardCompanionGridProps {
  companions: CompanionProps[];
}

/** First ghost completes a 2-column row. Later ghosts only appear in the 3-column row. */
function ghostLayoutClass(companionCount: number, index: number) {
  const fillsNarrowRow = companionCount % 2 === 1 && index === 0;
  return fillsNarrowRow
    ? "flex h-full flex-col"
    : "hidden h-full lg:flex lg:flex-col";
}

function DashboardCompanionGrid({ companions }: DashboardCompanionGridProps) {
  const ghostCount = Math.max(0, TARGET_SLOT_COUNT - companions.length);

  return (
    <motion.div
      layout
      className="grid w-full grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3"
    >
      <AnimatePresence mode="popLayout">
        {companions.map((companion, index) => (
          <motion.div
            key={companion.id}
            layout
            className="flex h-full min-w-0 flex-col"
            variants={motionVariants.cardPop}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ ...motionTransition.soft, delay: index * 0.04 }}
          >
            <CompanionOverviewCard companion={companion} />
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
