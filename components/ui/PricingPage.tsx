"use client";

import { useState } from "react";
import { Check, Zap, Crown, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchSubscriptionStatus } from "@/app/(app)/actions/subs";
import LoadingSpinner from "./LoadingSpinner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const TIERS = [
  {
    key: "free",
    name: "Free",
    monthly: 0,
    yearly: 0,
    description: "Perfect to get started",
    features: [
      "7-day trial",
      "1 Companion max",
      "6-Minute daily total credit",
      "2-Minute max per session",
      "Daily reset at midnight",
      "Standard response speed",
      "Watermarked sessions",
    ],
    cta: "Stay Free",
    popular: false,
  },
  {
    key: "pro",
    name: "Pro",
    monthly: 9,
    yearly: 90,
    description: "For users who want more",
    features: [
      "Unlimited companions",
      "15-Minute session length",
      "Unlimited daily sessions",
      "Fast AI response speed",
      "Extended conversation memory",
      "Premium avatars (No watermarks)",
    ],
    cta: "Go Pro",
    popular: true,
  },
  {
    key: "king",
    name: "King",
    monthly: 49,
    yearly: 490,
    description: "Rule the conversation",
    features: [
      "Everything in Pro",
      "60-Minute session length",
      "Ultra-low latency (Instant AI)",
      "Infinite context memory",
      "Exclusive ultra-realistic avatars",
      "VIP personal onboarding",
    ],
    cta: "Claim Your Throne",
    crown: true,
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

export default function PricingPage() {
  const { user: clerk_user, isLoaded: isClerkLoaded } = useUser();
  const clerk_user_id = clerk_user?.id;
  const router = useRouter();

  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const {
    data: userData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users", clerk_user_id],
    enabled: !!clerk_user_id,
    queryFn: () => fetchSubscriptionStatus(clerk_user_id!),
  });

  const handleSubscribe = async (tierKey: string) => {
    if (
      tierKey === "free" &&
      userData?.plan !== "free" &&
      userData?.plan !== undefined
    ) {
      setShowCancelDialog(true);
      return;
    }

    if (tierKey === "free") {
      router.push("/dashboard");
      return;
    }

    try {
      setLoadingTier(tierKey);
      const res = await fetch("/api/paystack/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: tierKey, interval }),
      });
      const data = await res.json();
      if (data.authorization_url) window.location.href = data.authorization_url;
    } catch (err) {
      toast.error("Connection failed");
      setLoadingTier(null);
    }
  };

  const confirmDowngrade = async () => {
    try {
      setLoadingTier("free");
      const res = await fetch("/api/paystack/cancel", { method: "POST" });
      if (res.ok) {
        toast.success("Subscription Cancelled", {
          description: "You are now on the Free plan.",
        });
        refetch();
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Error", { description: "Could not process cancellation." });
    } finally {
      setLoadingTier(null);
      setShowCancelDialog(false);
    }
  };

  if (!isClerkLoaded || (clerk_user_id && isLoading)) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-transparent py-25 px-4 sm:px-6 mt-3 text-white">
      {/* CANCEL CONFIRMATION DIALOG */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="bg-zinc-900 border border-white/10 rounded-3xl backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-white">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Downgrading to the Free plan will remove your Pro benefits
              immediately. You will lose access to unlimited companions and
              premium voices.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="bg-white/5 text-white hover:bg-white/10 border-none rounded-full">
              Wait, keep it
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDowngrade}
              className="bg-red-500 hover:bg-red-600 text-white border-none rounded-full font-bold"
            >
              Yes, Downgrade
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* BACKGROUND DESIGN */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 4 }}
      >
        <div className="absolute top-20 -left-32 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
      </motion.div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent font-extrabold">
            Choose Your Power
          </h1>
          <p className="text-md md:text-xl text-white/70 mt-4 max-w-2xl mx-auto">
            Most people stay quiet.{" "}
            <span className="text-amber-300 font-medium">
              You don’t have to.
            </span>
          </p>

          <div className="mt-8 flex items-center justify-center gap-4 bg-white/5 border border-white/10 p-1.5 rounded-full w-fit mx-auto">
            <button
              onClick={() => setInterval("monthly")}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-200 cursor-pointer ${interval === "monthly" ? "bg-white text-black shadow-lg" : "bg-transparent text-white/70"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setInterval("yearly")}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-200 cursor-pointer ${interval === "yearly" ? "bg-white text-black shadow-lg" : "bg-transparent text-white/70"}`}
            >
              Yearly
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {TIERS.map((tier, i) => {
            const isCurrentPlan = userData?.plan === tier.key;
            const isThisButtonLoading = loadingTier === tier.key;
            const isDowngradeBtn =
              tier.key === "free" && userData?.plan !== "free";

            return (
              <motion.div
                key={tier.key}
                variants={fadeUp}
                initial="initial"
                animate="animate"
                transition={{ delay: i * 0.12 }}
                className="relative"
              >
                {tier.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold px-6 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4" /> MOST POPULAR
                    </div>
                  </div>
                )}
                {tier.crown && (
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 5 }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 z-20"
                  >
                    <Crown className="w-14 h-14 text-yellow-400 drop-shadow-lg" />
                  </motion.div>
                )}

                <div className="relative rounded-3xl p-6 pt-10 border border-white/10 backdrop-blur-xl transition-all duration-300 hover:scale-[1.015] h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {tier.name}
                    </h3>
                    <div className="mb-6">
                      <span className="text-5xl font-extrabold text-white">
                        ${interval === "monthly" ? tier.monthly : tier.yearly}
                      </span>
                      <span className="text-white/60 text-lg">
                        {interval === "monthly" ? "/month" : "/year"}
                      </span>
                    </div>
                    <p className="text-white/70 mb-6 min-h-12">
                      {tier.description}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="text-white/90 text-sm font-inter">
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    disabled={loadingTier !== null || isCurrentPlan}
                    className={`w-full h-12 text-lg font-bold rounded-full flex items-center justify-center gap-2 transition-all duration-300 
                      ${
                        isCurrentPlan
                          ? "bg-emerald-500 text-white cursor-default opacity-100 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                          : isDowngradeBtn
                            ? "bg-white/5 text-white/60 hover:bg-red-500/10 hover:text-red-400 border border-white/10"
                            : tier.popular || tier.crown
                              ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg"
                              : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                      }`}
                    onClick={() => handleSubscribe(tier.key)}
                  >
                    {isThisButtonLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isCurrentPlan ? (
                      "Active"
                    ) : isDowngradeBtn ? (
                      "Downgrade to Free"
                    ) : (
                      tier.cta
                    )}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
