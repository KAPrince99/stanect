"use client";
import React, { memo } from "react";

interface TabCardProps {
  name: string;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  onTabClick: (index: number) => void;
}

function TabCard({
  name,
  index,
  isActive,
  isCompleted,
  onTabClick,
}: TabCardProps) {
  const tabClassName = isActive
    ? isCompleted
      ? "bg-white/15 text-amber-300 border border-amber-400/40 rounded-sm"
      : "bg-white/20 rounded-sm text-white border border-transparent"
    : isCompleted
      ? "bg-amber-400/10 text-amber-300 border border-amber-400/30 rounded-sm"
      : "text-white/80 border border-transparent hover:text-white";

  return (
    <div
      className={`px-2.5 py-1 cursor-pointer transition-all ${tabClassName}`}
      onClick={() => onTabClick(index)}
    >
      {name}
    </div>
  );
}

export default memo(TabCard);
