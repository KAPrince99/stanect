"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { memo, useCallback, useState } from "react";
import { toast } from "sonner";

import { fetchSubscriptionStatus } from "@/app/(app)/actions/subs";
import { TIERS } from "@/app/constants";

import LoadingSpinner from "./LoadingSpinner";
import PricingPageView from "./pricing/PricingPageView";
import type { BillingInterval } from "./pricing/pricingShared";

type TierKey = (typeof TIERS)[number]["key"];

function PricingPage() {
  const { user, isLoaded: isClerkLoaded } = useUser();
  const router = useRouter();

  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>("monthly");
  const [pendingTierKey, setPendingTierKey] = useState<TierKey | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [currencyDialogTier, setCurrencyDialogTier] = useState<TierKey | null>(
    null,
  );

  const clerkUserId = user?.id;

  const {
    data: subscriptionData,
    isLoading,
    refetch: refetchSubscriptionStatus,
  } = useQuery({
    queryKey: ["subscription", clerkUserId],
    enabled: !!clerkUserId,
    queryFn: () => fetchSubscriptionStatus(),
    staleTime: 1000 * 60 * 5,
  });

  const startCheckout = useCallback(
    async (tierKey: TierKey) => {
      try {
        setPendingTierKey(tierKey);

        const response = await fetch("/api/paystack/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: tierKey, interval: billingInterval }),
        });
        const data = await response.json();

        if (!response.ok || !data.authorization_url) {
          throw new Error("Subscription initialization failed");
        }

        window.location.href = data.authorization_url;
      } catch {
        toast.error("Connection failed");
        setPendingTierKey(null);
      }
    },
    [billingInterval],
  );

  const handleSubscribe = useCallback(
    async (tierKey: TierKey) => {
      const currentPlan = subscriptionData?.plan;

      if (tierKey === "free" && currentPlan && currentPlan !== "free") {
        setIsCancelDialogOpen(true);
        return;
      }

      if (tierKey === "free") {
        router.push("/dashboard");
        return;
      }

      setCurrencyDialogTier(tierKey);
    },
    [router, subscriptionData],
  );

  const confirmCurrencyAndPay = useCallback(async () => {
    const tierKey = currencyDialogTier;
    setCurrencyDialogTier(null);
    if (!tierKey || tierKey === "free") return;
    await startCheckout(tierKey);
  }, [currencyDialogTier, startCheckout]);

  const confirmDowngrade = useCallback(async () => {
    try {
      setPendingTierKey("free");

      const response = await fetch("/api/paystack/cancel", { method: "POST" });

      if (!response.ok) {
        throw new Error("Could not process cancellation");
      }

      toast.success("Subscription Cancelled", {
        description: "You are now on the Free plan.",
      });

      await refetchSubscriptionStatus();
    } catch {
      toast.error("Error", { description: "Could not process cancellation." });
    } finally {
      setPendingTierKey(null);
      setIsCancelDialogOpen(false);
    }
  }, [refetchSubscriptionStatus]);

  if (!isClerkLoaded) {
    return <LoadingSpinner />;
  }

  if (clerkUserId && isLoading && !subscriptionData) {
    return <LoadingSpinner />;
  }

  const currencyTier = TIERS.find((tier) => tier.key === currencyDialogTier);
  const currencyUsdPrice = currencyTier
    ? billingInterval === "monthly"
      ? currencyTier.monthly
      : currencyTier.yearly
    : 0;

  return (
    <PricingPageView
      billingInterval={billingInterval}
      onIntervalChange={setBillingInterval}
      currentPlan={subscriptionData?.plan}
      pendingTierKey={pendingTierKey}
      onSelectTier={handleSubscribe}
      isCancelDialogOpen={isCancelDialogOpen}
      onCancelDialogOpenChange={setIsCancelDialogOpen}
      onConfirmDowngrade={confirmDowngrade}
      currencyDialogTier={currencyDialogTier}
      onCurrencyDialogOpenChange={(open) => {
        if (!open) setCurrencyDialogTier(null);
      }}
      onConfirmCurrencyAndPay={confirmCurrencyAndPay}
      currencyPlanName={currencyTier?.name ?? "Pro"}
      currencyUsdPrice={currencyUsdPrice}
      currencyIntervalLabel={billingInterval === "monthly" ? "/month" : "/year"}
    />
  );
}

export default memo(PricingPage);
