"use client";

import { memo } from "react";

import { TIERS } from "@/app/constants";

import PricingCancelDialog from "./PricingCancelDialog";
import PricingCurrencyDialog from "./PricingCurrencyDialog";
import { PricingBackground } from "./PricingBackground";
import { PricingHeader } from "./PricingHeader";
import { PricingTierCard } from "./PricingTierCard";
import type { BillingInterval } from "./pricingShared";

type TierKey = (typeof TIERS)[number]["key"];

interface PricingPageViewProps {
  billingInterval: BillingInterval;
  onIntervalChange: (interval: BillingInterval) => void;
  currentPlan?: string;
  pendingTierKey: TierKey | null;
  onSelectTier: (tierKey: TierKey) => void;
  isCancelDialogOpen: boolean;
  onCancelDialogOpenChange: (open: boolean) => void;
  onConfirmDowngrade: () => void;
  currencyDialogTier: TierKey | null;
  onCurrencyDialogOpenChange: (open: boolean) => void;
  onConfirmCurrencyAndPay: () => void;
  currencyPlanName: string;
  currencyUsdPrice: number;
  currencyIntervalLabel: string;
}

function PricingPageView({
  billingInterval,
  onIntervalChange,
  currentPlan,
  pendingTierKey,
  onSelectTier,
  isCancelDialogOpen,
  onCancelDialogOpenChange,
  onConfirmDowngrade,
  currencyDialogTier,
  onCurrencyDialogOpenChange,
  onConfirmCurrencyAndPay,
  currencyPlanName,
  currencyUsdPrice,
  currencyIntervalLabel,
}: PricingPageViewProps) {
  return (
    <div className="mt-3 min-h-screen bg-transparent px-4 py-25 text-white sm:px-6">
      <PricingCancelDialog
        open={isCancelDialogOpen}
        onOpenChange={onCancelDialogOpenChange}
        onConfirm={onConfirmDowngrade}
      />

      <PricingCurrencyDialog
        open={currencyDialogTier !== null}
        onOpenChange={onCurrencyDialogOpenChange}
        onConfirm={onConfirmCurrencyAndPay}
        planName={currencyPlanName}
        usdPrice={currencyUsdPrice}
        intervalLabel={currencyIntervalLabel}
      />

      <PricingBackground />

      <div className="relative z-10 mx-auto max-w-6xl">
        <PricingHeader
          billingInterval={billingInterval}
          onIntervalChange={onIntervalChange}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {TIERS.map((tier, index) => (
            <PricingTierCard
              key={tier.key}
              tier={tier}
              index={index}
              billingInterval={billingInterval}
              currentPlan={currentPlan}
              pendingTierKey={pendingTierKey}
              onSelectTier={onSelectTier}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(PricingPageView);
