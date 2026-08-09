"use client";

import { motion } from "framer-motion";
import { memo } from "react";

import { motionTransition, motionVariants } from "@/lib/motion";

interface DashboardWelcomeHeaderProps {
  welcomeUser: string;
  hasCompanions: boolean;
  companionCount: number;
}

function DashboardWelcomeHeader({
  welcomeUser,
  hasCompanions,
  companionCount,
}: DashboardWelcomeHeaderProps) {
  return (
    <motion.div
      variants={motionVariants.fadeUp}
      initial="hidden"
      animate="visible"
      transition={motionTransition.soft}
      className={`mx-auto w-full max-w-5xl text-center ${hasCompanions ? "mb-10" : "mb-8"}`}
    >
      <h1 className="font-display text-2xl tracking-tight sm:text-3xl md:text-4xl">
        <span className="bg-linear-to-b from-white to-white/75 bg-clip-text text-transparent">
          {hasCompanions
            ? `Welcome back, ${welcomeUser}.`
            : "Welcome to Stanect"}
        </span>
      </h1>

      {hasCompanions && (
        <p className="mt-3 text-sm text-white/60 sm:text-base">
          {companionCount === 1
            ? "1 companion ready to practice"
            : `${companionCount} companions ready to practice`}
        </p>
      )}
    </motion.div>
  );
}

export default memo(DashboardWelcomeHeader);
