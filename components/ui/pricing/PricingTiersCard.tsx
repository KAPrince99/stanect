"use client";

import { TIERS } from "@/app/constants";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Crown, Loader2, Zap } from "lucide-react";

import { motionTransition } from "@/lib/motion";

import { pricingFadeUp, type BillingInterval } from "./pricingShared";

type PricingTier = (typeof TIERS)[number];

interface PricingTierCardProps {
  tier: PricingTier;
  index: number;
  billingInterval: BillingInterval;
  currentPlan?: string;
  pendingTierKey: string | null;
  onSelectTier: (tierKey: PricingTier["key"]) => void;
}

export function PricingTierCard({
  tier,
  index,
  billingInterval,
  currentPlan,
  pendingTierKey,
  onSelectTier,
}: PricingTierCardProps) {
  const isCurrentPlan = currentPlan === tier.key;
  const isPending = pendingTierKey === tier.key;
  const isDowngrade = tier.key === "free" && currentPlan !== "free";
  const price = billingInterval === "monthly" ? tier.monthly : tier.yearly;
  const periodLabel = billingInterval === "monthly" ? "/month" : "/year";

  const buttonClassName = isCurrentPlan
    ? "bg-emerald-500 text-white cursor-default opacity-100 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
    : isDowngrade
      ? "border border-white/10 bg-white/5 text-white/60 hover:bg-red-500/10 hover:text-red-400"
      : tier.popular || tier.crown
        ? "bg-linear-to-r from-amber-400 to-orange-500 text-black shadow-lg"
        : "border border-white/20 bg-white/10 text-white hover:bg-white/20";

  return (
    <motion.div
      variants={pricingFadeUp}
      initial="initial"
      animate="animate"
      transition={{ ...motionTransition.soft, delay: 0.16 + index * 0.1 }}
      whileHover={{ y: -6 }}
      className="relative"
    >
      {tier.popular ? (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...motionTransition.smooth, delay: 0.28 + index * 0.08 }}
          className="absolute top-[-1.25rem] left-1/2 z-20 -translate-x-1/2"
        >
          <div className="type-cta flex items-center gap-2 rounded-full bg-linear-to-r from-amber-400 to-orange-500 px-5 py-1.5 text-xs text-black shadow-lg">
            <Zap className="h-3.5 w-3.5" />
            MOST POPULAR
          </div>
        </motion.div>
      ) : null}

      {tier.crown ? (
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute top-[-2.5rem] left-1/2 z-20 -translate-x-1/2"
        >
          <Crown className="h-14 w-14 text-yellow-400 drop-shadow-lg" />
        </motion.div>
      ) : null}

      <div className="relative flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 pt-10 backdrop-blur-xl transition-colors duration-300 hover:border-white/20">
        <div>
          <h3 className="type-title mb-2">{tier.name}</h3>

          <div className="mb-5 min-h-14 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${tier.key}-${billingInterval}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={motionTransition.soft}
              >
                <span className="type-display text-[2rem] sm:text-[2.5rem]">
                  {price === 0 ? "Free" : `$${price}`}
                </span>
                {price > 0 ? (
                  <span className="type-meta ml-1 text-sm">{periodLabel}</span>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="type-body mb-6 min-h-12">{tier.description}</p>

          <ul className="mb-8 space-y-3">
            {tier.features.map((feature, featureIndex) => (
              <motion.li
                key={feature.text}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  ...motionTransition.soft,
                  delay: 0.22 + index * 0.08 + featureIndex * 0.03,
                }}
              >
                <Check
                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                    feature.comingSoon ? "text-white/35" : "text-emerald-400"
                  }`}
                />
                <span
                  className={`type-label flex flex-wrap items-center gap-2 ${
                    feature.comingSoon ? "text-white/55" : "text-white/90"
                  }`}
                >
                  {feature.text}
                  {feature.comingSoon ? (
                    <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-white/55 uppercase">
                      Coming soon
                    </span>
                  ) : null}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        <Button
          disabled={pendingTierKey !== null || isCurrentPlan}
          className={`type-cta flex h-11 w-full items-center justify-center gap-2 rounded-full transition-all duration-300 ${buttonClassName}`}
          onClick={() => onSelectTier(tier.key)}
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isCurrentPlan ? (
            "Active"
          ) : isDowngrade ? (
            "Downgrade to Free"
          ) : (
            tier.cta
          )}
        </Button>
      </div>
    </motion.div>
  );
}
