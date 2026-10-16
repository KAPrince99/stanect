"use client";
import React, { memo } from "react";
import { motion } from "framer-motion";
import { motionTransition } from "@/lib/motion";

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
  const textClassName = isActive
    ? "text-white"
    : isCompleted
      ? "text-amber-300"
      : "text-white/80 hover:text-white";

  return (
    // eslint-disable-next-line no-restricted-syntax -- segmented tab control
    <button
      type="button"
      className={`type-label relative cursor-pointer rounded-full px-2 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40 sm:px-3 ${textClassName}`}
      onClick={() => onTabClick(index)}
    >
      {isCompleted && !isActive && (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-amber-400/30 bg-amber-400/10"
        />
      )}

      {isActive && (
        <motion.span
          layoutId="tab-active-pill"
          transition={motionTransition.smooth}
          className="absolute inset-0 rounded-full border border-white/20 bg-white/15"
        />
      )}

      <span className="relative z-10 text-xs font-medium sm:text-sm">{name}</span>
    </button>
  );
}

export default memo(TabCard);
