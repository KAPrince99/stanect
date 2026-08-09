"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { memo, useCallback, useState } from "react";
import { toast } from "sonner";

import { fetchSubscriptionStatus } from "@/app/(app)/actions/subs";
import { TIERS } from "@/app/constants";

import LoadingSpinner from "./LoadingSpinner";
import { PricingBackground } from "./pricing/PricingBackground";
import PricingCancelDialog from "./pricing/PricingCancelDialog";
import { PricingHeader } from "./pricing/PricingHeader";
import { PricingTierCard } from "./pricing/PricingTierCard";
import type { BillingInterval } from "./pricing/pricingShared";

type TierKey = (typeof TIERS)[number]["key"];

function PricingPage() {
  const { user, isLoaded: isClerkLoaded } = useUser();
  const router = useRouter();

  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>("monthly");
  const [pendingTierKey, setPendingTierKey] = useState<TierKey | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const clerkUserId = user?.id;

  const {
    data: subscriptionData,
    isLoading,
    refetch: refetchSubscriptionStatus,
  } = useQuery({
    queryKey: ["subscription", clerkUserId],
    enabled: !!clerkUserId,
    queryFn: () => fetchSubscriptionStatus(clerkUserId!),
    staleTime: 1000 * 60 * 5,
  });

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
    [billingInterval, router, subscriptionData],
  );

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

  return (
    <div className="mt-3 min-h-screen bg-transparent px-4 py-25 text-white sm:px-6">
      <PricingCancelDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        onConfirm={confirmDowngrade}
      />

      <PricingBackground />

      <div className="relative z-10 mx-auto max-w-6xl">
        <PricingHeader
          billingInterval={billingInterval}
          onIntervalChange={setBillingInterval}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {TIERS.map((tier, index) => (
            <PricingTierCard
              key={tier.key}
              tier={tier}
              index={index}
              billingInterval={billingInterval}
              currentPlan={subscriptionData?.plan}
              pendingTierKey={pendingTierKey}
              onSelectTier={handleSubscribe}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
export default memo(PricingPage);
