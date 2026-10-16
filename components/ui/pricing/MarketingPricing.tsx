"use client";

import { useState } from "react";

import PricingPageView from "./PricingPageView";
import type { BillingInterval } from "./pricingShared";

/** Homepage pricing: sell the plans, send people to sign in. */
export default function MarketingPricing() {
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>("monthly");

  return (
    <PricingPageView
      intent="marketing"
      billingInterval={billingInterval}
      onIntervalChange={setBillingInterval}
    />
  );
}
