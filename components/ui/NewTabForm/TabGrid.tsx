"use client";
import React, { memo } from "react";
import TabCard from "./TabCard";
import { motion } from "framer-motion";
import { motionVariants } from "@/lib/motion";

interface TabItem {
  name: string;
}

interface TabGridProps {
  tabs: TabItem[];
  completedTabs: boolean[];
  isActive: number;
  onTabClick: (index: number) => void;
}

function TabGrid({ tabs, completedTabs, isActive, onTabClick }: TabGridProps) {
  return (
    <motion.div
      variants={motionVariants.fadeUp}
      initial="hidden"
      animate="visible"
      className="flex items-center min-w-[400px] max-w-[600px] mx-auto mb-5 rounded-xl border border-white/10 bg-white/8 backdrop-blur-md p-2"
    >
      {tabs.map((tab, index) => {
        const isCompleted = Boolean(completedTabs[index]);
        const isLastTab = index === tabs.length - 1;

        return (
          <React.Fragment key={tab.name}>
            <TabCard
              name={tab.name}
              index={index}
              isActive={isActive === index}
              isCompleted={isCompleted}
              onTabClick={onTabClick}
            />

            {!isLastTab && (
              <div
                aria-hidden="true"
                className={`mx-1 h-px flex-1 rounded-full transition-colors ${isCompleted ? "bg-amber-400/50" : "bg-white/20"}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </motion.div>
  );
}

export default memo(TabGrid);
