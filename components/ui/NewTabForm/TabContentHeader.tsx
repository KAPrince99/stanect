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
      className={`flex items-center justify-center my-4 ${className ?? ""}`.trim()}
    >
      <h2
        className={`text-4xl md:text-5xl font-display tracking-tight text-center bg-linear-to-r from-white via-white to-white/70 bg-clip-text text-transparent ${
          titleClassName ?? ""
        }`.trim()}
      >
        {title}
      </h2>
    </div>
  );
}

export default memo(TabContentHeader);
