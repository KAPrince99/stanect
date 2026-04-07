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
      className="grid grid-cols-2 gap-8 max-w-4xl mx-auto lg:grid-cols-3 md:mx-30"
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
