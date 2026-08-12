"use client";

import { AnimatePresence, motion } from "framer-motion";
import { memo } from "react";

import { motionTransition, motionVariants } from "@/lib/motion";
import { CompanionProps } from "@/types/types";

import CompanionGhostCard from "./CompanionGhostCard";
import CompanionOverviewCard from "./CompanionOverviewCard";

/** Fill the first row visually until the user has a full set of companions. */
export const TARGET_SLOT_COUNT = 3;

interface DashboardCompanionGridProps {
  companions: CompanionProps[];
}

function DashboardCompanionGrid({ companions }: DashboardCompanionGridProps) {
  const ghostCount = Math.max(0, TARGET_SLOT_COUNT - companions.length);

  return (
    <motion.div
      layout
      className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
    >
      <AnimatePresence mode="popLayout">
        {companions.map((companion, index) => (
          <motion.div
            key={companion.id}
            layout
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
        <CompanionGhostCard key={`ghost-${index}`} index={index} />
      ))}
    </motion.div>
  );
}

export default memo(DashboardCompanionGrid);
