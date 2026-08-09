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
      className={`w-full text-center ${hasCompanions ? "mb-10" : "mb-8"}`}
    >
      <h1 className="type-display">
        {hasCompanions ? `Welcome back, ${welcomeUser}` : "Welcome to Stanect"}
      </h1>

      {hasCompanions && (
        <p className="type-meta mt-3 text-[0.875rem] sm:text-[0.9375rem]">
          {companionCount === 1
            ? "1 companion ready to practice"
            : `${companionCount} companions ready to practice`}
        </p>
      )}
    </motion.div>
  );
}

export default memo(DashboardWelcomeHeader);
