"use client";

import { AnimatePresence, motion } from "framer-motion";
import { memo } from "react";

import { motionTransition, motionVariants } from "@/lib/motion";
import { CompanionProps } from "@/types/types";

import CompanionOverviewCard from "./CompanionOverviewCard";

interface DashboardCompanionGridProps {
  companions: CompanionProps[];
}

function DashboardCompanionGrid({ companions }: DashboardCompanionGridProps) {
  return (
    <motion.div
      layout
      className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3"
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
    </motion.div>
  );
}

export default memo(DashboardCompanionGrid);
