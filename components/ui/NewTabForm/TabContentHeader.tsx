"use client";
import React, { memo } from "react";
import { motion } from "framer-motion";
import { motionVariants } from "@/lib/motion";

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
    <motion.div
      className={`flex items-center justify-center my-4 ${className ?? ""}`.trim()}
      // variants={motionVariants.fadeUp}
      // initial="hidden"
      // animate="visible"
    >
      <h2
        className={`text-4xl md:text-5xl font-display tracking-tight text-center bg-linear-to-r from-white via-white to-white/70 bg-clip-text text-transparent ${
          titleClassName ?? ""
        }`.trim()}
      >
        {title}
      </h2>
    </motion.div>
  );
}

export default memo(TabContentHeader);
