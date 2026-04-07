"use client";

import { motion } from "framer-motion";
import { motionTransition, motionVariants } from "@/lib/motion";
import { memo } from "react";

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
      className={`text-center ${hasCompanions ? "mb-10" : "mb-8"}`}
    >
      <h1 className="text-3xl md:text-5xl tracking-tight bg-linear-to-r from-white via-white to-white/70 bg-clip-text text-transparent lg:-ml-35">
        {hasCompanions ? `Welcome back, ${welcomeUser}.` : `Welcome to Stanect`}
      </h1>

      {hasCompanions && (
        <p className="mt-4 text-white/70 text-md md:text-lg lg:-ml-35">
          {`You have ${companionCount} ${companionCount === 1 ? "companion" : "companions"} waiting`}
        </p>
      )}
    </motion.div>
  );
}

export default memo(DashboardWelcomeHeader);
