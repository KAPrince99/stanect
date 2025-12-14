// Pricing page
"use client";

import { useState, useEffect } from "react";
import { Check, Zap, Crown, Sparkles, Star, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { fetchSubscriptionStatus } from "../actions/subs";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// ---------------- Supabase Realtime client ----------------
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ---------------- Types ----------------
type UserData = {
  id: string;
  clerk_user_id: string;
  email: string | null;
  name: string | null;
  plan: "free" | "pro" | "king" | null;
  status: "active" | "pending" | "cancelled" | null;
};

type SubscriptionStatus = {
  plan: UserData["plan"];
  status: UserData["status"];
} | null; // It can now explicitly be null

// ---------------- Animations ----------------
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

// ---------------- Pricing tiers ----------------
const TIERS = [
  {
    key: "free",
    name: "Free",
    monthly: 0,
    yearly: 0,
    description: "Perfect to get started",
    features: [
      "1 companion max",
      "2-minute call",
      "Basic avatars",
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
    description: "For men who want more",
    features: [
      "Unlimited companions",
      "10-minute max calls",
      "Premium avatars",
      "No watermarks",
      "Priority voice processing",
      "Early access to new voices",
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
      "Unlimited call duration",
      "Exclusive ultra-realistic avatars",
      "Custom voice training (coming soon)",
      "Private beta access",
      "Personal onboarding call",
      "Your name in the app credits",
    ],
    cta: "Claim Your Throne",
    crown: true,
  },
];

export default function PricingPage() {
  const { user: clerk_user } = useUser();
  const clerk_user_id = clerk_user?.id;
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  // ---------------- Fetch subscription status ----------------
  const { data, isLoading } = useQuery<SubscriptionStatus>({
    queryKey: ["users", clerk_user_id],
    enabled: !!clerk_user_id,
    queryFn: async () => {
      if (!clerk_user_id) return null;
      const user = await fetchSubscriptionStatus(clerk_user_id);
      setUserData(user);
      return user;
    },
  });

  // ---------------- Realtime updates ----------------
  useEffect(() => {
    if (!clerk_user_id) return;

    const channel = supabase
      .channel(`user-sub-${clerk_user_id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "users",
          filter: `clerk_user_id=eq.${clerk_user_id}`,
        },
        (payload) => {
          setUserData(payload.new as UserData);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clerk_user_id]);

  // inside your client PricingPage component
  const handleSubscribe = async (tierKey: string) => {
    try {
      setLoadingTier(tierKey);
      const res = await fetch("/api/paystack/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: tierKey, interval }),
      });
      const data = await res.json();

      if (data.authorization_url) {
        toast.success("Redirecting to Paystack for initial payment...");
        // *** THIS IS THE CRITICAL REDIRECT ***
        window.location.href = data.authorization_url;
        return;
      }

      if (data.subscription_code && !data.authorization_url) {
        // Should not happen for first-time customers but good fallback
        toast.success("Subscription created — waiting for activation...");
        return;
      }

      toast.error(data.error || "Failed to create subscription");
    } catch (err) {
      toast.error("Error creating subscription");
    } finally {
      setLoadingTier(null);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="min-h-screen bg-transparent py-16 px-4 sm:px-6 mt-3 text-white">
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
        {/* Title + Toggle */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent font-extrabold">
            Choose Your Power
          </h1>
          <p className="text-lg md:text-2xl text-white/70 mt-4 max-w-2xl mx-auto">
            Most men stay quiet.{" "}
            <span className="text-amber-300 font-medium">
              You don’t have to.
            </span>
          </p>

          <div className="mt-8 flex items-center justify-center gap-4 bg-white/5 border border-white/10 p-1.5 rounded-full w-fit mx-auto">
            <button
              onClick={() => setInterval("monthly")}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                interval === "monthly"
                  ? "bg-white text-black shadow-lg"
                  : "bg-transparent text-white/70"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setInterval("yearly")}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                interval === "yearly"
                  ? "bg-white text-black shadow-lg"
                  : "bg-transparent text-white/70"
              }`}
            >
              Yearly
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {TIERS.map((tier, i) => (
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

              <div
                className={`relative rounded-3xl p-6 pt-10 border backdrop-blur-xl transition-all duration-300 hover:scale-[1.015] h-full flex flex-col justify-between`}
              >
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
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
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/90 text-sm md:text-base font-inter">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  disabled={loadingTier !== null || userData?.plan === tier.key}
                  className={`w-full h-12 text-lg font-bold rounded-full flex items-center justify-center gap-2 transition-all duration-300 ${
                    tier.popular
                      ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg hover:from-amber-500 hover:to-orange-600"
                      : tier.crown
                      ? "bg-gradient-to-r from-yellow-400 to-amber-600 text-black shadow-lg hover:from-yellow-500 hover:to-amber-700"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                  }`}
                  onClick={() => handleSubscribe(tier.key)}
                >
                  {loadingTier === tier.key ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : userData?.plan === tier.key ? (
                    "Active"
                  ) : (
                    tier.cta
                  )}
                  {(tier.popular || tier.crown) &&
                    userData?.plan !== tier.key && (
                      <span className="inline-block ml-1">
                        {tier.popular && <Sparkles className="w-4 h-4" />}
                        {tier.crown && <Crown className="w-4 h-4" />}
                      </span>
                    )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social Proof */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-white/60 text-lg font-inter">
            Join 8,247+ men who speak with confidence
          </p>
          <div className="flex justify-center gap-1 mt-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
            ))}
            <span className="text-amber-400 ml-2 font-inter font-medium">
              4.9/5
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
