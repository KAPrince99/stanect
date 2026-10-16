"use client";

import { memo } from "react";
import { motion } from "framer-motion";

import { TIERS } from "@/app/constants";

import PricingCancelDialog from "./PricingCancelDialog";
import PricingCurrencyDialog from "./PricingCurrencyDialog";
import { PricingBackground } from "./PricingBackground";
import { PricingHeader } from "./PricingHeader";
import { PricingTierCard } from "./PricingTierCard";
import {
  PRICING_TIER_GRID,
  pricingStagger,
  type BillingInterval,
  type PricingIntent,
} from "./pricingShared";

type TierKey = (typeof TIERS)[number]["key"];

interface PricingPageViewProps {
  intent?: PricingIntent;
  billingInterval: BillingInterval;
  onIntervalChange: (interval: BillingInterval) => void;
  currentPlan?: string;
  pendingTierKey?: TierKey | null;
  onSelectTier?: (tierKey: TierKey) => void;
  isCancelDialogOpen?: boolean;
  onCancelDialogOpenChange?: (open: boolean) => void;
  onConfirmDowngrade?: () => void;
  currencyDialogTier?: TierKey | null;
  onCurrencyDialogOpenChange?: (open: boolean) => void;
  onConfirmCurrencyAndPay?: () => void;
  currencyPlanName?: string;
  currencyUsdPrice?: number;
  currencyIntervalLabel?: string;
}

function PricingPageView({
  intent = "billing",
  billingInterval,
  onIntervalChange,
  currentPlan,
  pendingTierKey = null,
  onSelectTier,
  isCancelDialogOpen = false,
  onCancelDialogOpenChange,
  onConfirmDowngrade,
  currencyDialogTier = null,
  onCurrencyDialogOpenChange,
  onConfirmCurrencyAndPay,
  currencyPlanName = "Pro",
  currencyUsdPrice = 0,
  currencyIntervalLabel = "/month",
}: PricingPageViewProps) {
  const isMarketing = intent === "marketing";

  return (
    <div className="app-column-x mt-3 min-h-screen bg-transparent py-25 text-white">
      {isMarketing ? null : (
        <>
          <PricingCancelDialog
            open={isCancelDialogOpen}
            onOpenChange={onCancelDialogOpenChange ?? (() => {})}
            onConfirm={onConfirmDowngrade ?? (() => {})}
          />

          <PricingCurrencyDialog
            open={currencyDialogTier !== null}
            onOpenChange={onCurrencyDialogOpenChange ?? (() => {})}
            onConfirm={onConfirmCurrencyAndPay ?? (() => {})}
            planName={currencyPlanName}
            usdPrice={currencyUsdPrice}
            intervalLabel={currencyIntervalLabel}
          />
        </>
      )}

      <PricingBackground />

      <motion.div
        className="relative z-10 mx-auto max-w-6xl"
        variants={pricingStagger}
        initial="initial"
        animate="animate"
      >
        <PricingHeader
          billingInterval={billingInterval}
          onIntervalChange={onIntervalChange}
        />

        <div className={PRICING_TIER_GRID}>
          {TIERS.map((tier, index) => (
            <PricingTierCard
              key={tier.key}
              tier={tier}
              index={index}
              intent={intent}
              billingInterval={billingInterval}
              currentPlan={currentPlan}
              pendingTierKey={pendingTierKey}
              onSelectTier={onSelectTier}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default memo(PricingPageView);
