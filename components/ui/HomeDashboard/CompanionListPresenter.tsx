"use client";
import { motion, AnimatePresence } from "framer-motion";

import { CompanionProps } from "@/types/types";
import LoadingSpinner from "../LoadingSpinner";
import { memo } from "react";
import Fresh from "./Fresh";
import CompanionCard from "./companionCard";
import { motionTransition, motionVariants } from "@/lib/motion";
interface CompanionListPresenterProps {
  companions: CompanionProps[];
  welcomeUser: string;
  userLoaded: boolean;
  isLoading: boolean;
}

function CompanionListPresenter({
  companions,
  welcomeUser,
  userLoaded,
  isLoading,
}: CompanionListPresenterProps) {
  if (!userLoaded || isLoading) {
    return <LoadingSpinner />;
  }
  const hasCompanions = companions.length > 0;

  return (
    <div className="relative px-6 py-25 md:px-10 lg:px-16">
      <motion.div
        variants={motionVariants.fadeUp}
        initial="hidden"
        animate="visible"
        transition={motionTransition.soft}
        className={`text-center ${hasCompanions ? "mb-10" : "mb-8"}`}
      >
        <h1 className="text-3xl md:text-5xl tracking-tight bg-linear-to-r from-white via-white to-white/70 bg-clip-text text-transparent lg:-ml-35">
          {hasCompanions
            ? `Welcome back, ${welcomeUser}.`
            : `Welcome to Stanect`}
        </h1>

        {hasCompanions && (
          <p className="mt-4 text-white/70 text-md md:text-lg lg:-ml-35">
            {`You have ${companions.length} ${companions.length === 1 ? "companion" : "companions"} waiting`}
          </p>
        )}
      </motion.div>

      {companions.length === 0 ? (
        <Fresh />
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 lg:grid-cols-3  gap-8 max-w-4xl mx-auto md:mx-30 "
        >
          <AnimatePresence mode="popLayout">
            {companions.map((companion, i) => (
              <motion.div
                key={companion.id}
                layout
                variants={motionVariants.cardPop}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ ...motionTransition.soft, delay: i * 0.04 }}
              >
                <CompanionCard companion={companion} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
export default memo(CompanionListPresenter);
