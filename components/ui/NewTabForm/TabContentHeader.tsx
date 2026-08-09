"use client";

import React, { memo } from "react";

interface TabContentHeaderProps {
  title: string;
  className?: string;
  titleClassName?: string;
}

function TabContentHeader({
  title,
  className,
  titleClassName,
}: TabContentHeaderProps) {
  return (
    <div
      className={`my-6 flex items-center justify-center ${className ?? ""}`.trim()}
    >
      <h2
        className={`type-display text-center text-[1.75rem] sm:text-[2rem] ${
          titleClassName ?? ""
        }`.trim()}
      >
        {title}
      </h2>
    </div>
  );
}

export default memo(TabContentHeader);
