"use client";
import React, { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TabGrid from "./TabGrid";
import TabNavigation from "./TabNavigation";
import { motionVariants } from "@/lib/motion";

interface TabItem {
  name: string;
}

interface TabFormPresenterProps {
  tabs: TabItem[];
  completedTabs: boolean[];
  isActive: number;
  activeTabKey: number;
  transitionDirection: 1 | -1;
  onTabClick: (index: number) => void;
  activeTabContent: React.ReactNode;
  showNavigation: boolean;
  onPrevClick: () => void;
  onNextClick: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

function TabFormPresenter({
  tabs,
  completedTabs,
  isActive,
  activeTabKey,
  transitionDirection,
  onTabClick,
  activeTabContent,
  showNavigation,
  onPrevClick,
  onNextClick,
  canGoPrev,
  canGoNext,
}: TabFormPresenterProps) {
  return (
    <main className="-ml-30">
      <TabGrid
        tabs={tabs}
        completedTabs={completedTabs}
        isActive={isActive}
        onTabClick={onTabClick}
      />

      <div className="relative overflow-hidden lg:mx-50">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={activeTabKey}
            custom={transitionDirection}
            className="w-full"
            variants={motionVariants.tabContentSlide}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {activeTabContent}
          </motion.div>
        </AnimatePresence>
      </div>

      {showNavigation && (
        <TabNavigation
          onPrevClick={onPrevClick}
          onNextClick={onNextClick}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
        />
      )}
    </main>
  );
}

export default memo(TabFormPresenter);
