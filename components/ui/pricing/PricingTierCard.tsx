import { TIERS } from "@/app/constants";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, Crown, Loader2, Zap } from "lucide-react";

import { fadeUp, type BillingInterval } from "./pricingShared";

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
        ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg"
        : "border border-white/20 bg-white/10 text-white hover:bg-white/20";

  return (
    <motion.div
      variants={fadeUp}
      initial="initial"
      animate="animate"
      transition={{ delay: index * 0.12 }}
      className="relative"
    >
      {tier.popular ? (
        <div className="absolute top-[-1.25rem] left-1/2 z-20 -translate-x-1/2">
          <div className="type-cta flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-1.5 text-xs text-black shadow-lg">
            <Zap className="h-3.5 w-3.5" />
            MOST POPULAR
          </div>
        </div>
      ) : null}

      {tier.crown ? (
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
          className="absolute top-[-2.5rem] left-1/2 z-20 -translate-x-1/2"
        >
          <Crown className="h-14 w-14 text-yellow-400 drop-shadow-lg" />
        </motion.div>
      ) : null}

      <div className="relative flex h-full flex-col justify-between rounded-3xl border border-white/10 p-6 pt-10 backdrop-blur-xl transition-all duration-300 hover:scale-[1.015]">
        <div>
          <h3 className="type-title mb-2">{tier.name}</h3>

          <div className="mb-5">
            <span className="type-display text-[2rem] sm:text-[2.5rem]">
              ${price}
            </span>
            <span className="type-meta ml-1 text-sm">{periodLabel}</span>
          </div>

          <p className="type-body mb-6 min-h-12">{tier.description}</p>

          <ul className="mb-8 space-y-3">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span className="type-label text-white/90">{feature}</span>
              </li>
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
