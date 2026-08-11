"use client";

import { motion } from "framer-motion";
import { memo } from "react";

import { motionTransition, motionVariants } from "@/lib/motion";

interface DashboardWelcomeHeaderProps {
  welcomeUser: string;
  companionCount: number;
}

function possessiveName(name: string) {
  const trimmed = name.trim() || "Your";
  if (trimmed.toLowerCase() === "your") return "Your";
  return trimmed.endsWith("s") || trimmed.endsWith("S")
    ? `${trimmed}'`
    : `${trimmed}'s`;
}

function DashboardWelcomeHeader({
  welcomeUser,
  companionCount,
}: DashboardWelcomeHeaderProps) {
  return (
    <motion.div
      variants={motionVariants.fadeUp}
      initial="hidden"
      animate="visible"
      transition={motionTransition.soft}
      className="mb-10 w-full text-center"
    >
      <h1 className="type-display">{possessiveName(welcomeUser)} cast</h1>

      <p className="type-meta mt-3 text-[0.875rem] sm:text-[0.9375rem]">
        {companionCount === 1
          ? "1 companion ready to practice"
          : `${companionCount} companions ready to practice`}
      </p>
    </motion.div>
  );
}

export default memo(DashboardWelcomeHeader);
