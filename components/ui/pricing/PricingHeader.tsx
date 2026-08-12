"use client";

import { motion } from "framer-motion";

import { motionTransition } from "@/lib/motion";

import { pricingFadeUp, type BillingInterval } from "./pricingShared";

interface PricingHeaderProps {
  billingInterval: BillingInterval;
  onIntervalChange: (interval: BillingInterval) => void;
}

const INTERVAL_OPTIONS: BillingInterval[] = ["monthly", "yearly"];

export function PricingHeader({
  billingInterval,
  onIntervalChange,
}: PricingHeaderProps) {
  return (
    <motion.div
      className="mb-12 text-center"
      variants={pricingFadeUp}
      initial="initial"
      animate="animate"
    >
      <motion.h1
        className="type-display"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={motionTransition.soft}
      >
        Choose your plan
      </motion.h1>

      <motion.p
        className="type-body mx-auto mt-4 max-w-xl"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...motionTransition.soft, delay: 0.06 }}
      >
        Most people stay quiet.{" "}
        <span className="font-medium text-amber-300">You don’t have to.</span>
      </motion.p>

      <motion.div
        className="relative mx-auto mt-8 flex w-fit items-center justify-center gap-1 rounded-full border border-white/10 bg-white/5 p-1.5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...motionTransition.soft, delay: 0.12 }}
      >
        {INTERVAL_OPTIONS.map((option) => {
          const isActive = billingInterval === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onIntervalChange(option)}
              className={`type-label relative z-10 cursor-pointer rounded-full px-4 py-2 capitalize transition-colors duration-200 ${
                isActive
                  ? "text-black"
                  : "bg-transparent text-white/65 hover:text-white"
              }`}
            >
              {isActive ? (
                <motion.span
                  layoutId="pricing-billing-pill"
                  className="absolute inset-0 rounded-full bg-white"
                  transition={motionTransition.smooth}
                />
              ) : null}
              <span className="relative z-10">{option}</span>
            </button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
