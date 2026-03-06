"use client";
import React, { memo } from "react";
import TabGrid from "./TabGrid";
import TabNavigation from "./TabNavigation";

interface TabItem {
  name: string;
}

interface TabFormPresenterProps {
  tabs: TabItem[];
  completedTabs: boolean[];
  isActive: number;
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

      <div className="max-h-screen lg:mx-50">{activeTabContent}</div>

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
