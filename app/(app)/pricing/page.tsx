"use client";

import { Check, Zap, Crown, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

const tiers = [
  {
    name: "Free",
    price: "0",
    description: "Perfect to get started",
    features: [
      "3 companions max",
      "5-minute calls",
      "Basic avatars",
      "Watermarked sessions",
    ],
    cta: "Stay Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "19",
    description: "For men who want more",
    features: [
      "Unlimited companions",
      "30-minute calls",
      "Premium avatars",
      "No watermarks",
      "Priority voice processing",
      "Early access to new voices",
    ],
    cta: "Go Pro",
    popular: true,
    glow: "shadow-amber-400/40",
  },
  {
    name: "King",
    price: "49",
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1a36] via-[#1a3a80] to-[#1e4ea8] py-16 px-4 sm:px-6 mt-3">
      {/* Soft Background Movement */}
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
        {/* Hero */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            Choose Your Power
          </h1>

          <p className="text-lg md:text-2xl text-white/70 mt-4 max-w-2xl mx-auto">
            Most men stay quiet.
            <span className="text-amber-300 font-medium">
              {" "}
              You don’t have to.
            </span>
          </p>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ delay: i * 0.15 }}
              className={`relative`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-black font-display px-6 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4" />
                    MOST POPULAR
                  </div>
                </div>
              )}

              {/* King Crown */}
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
                className={`
                  relative rounded-3xl p-6 pt-10 border backdrop-blur-xl
                  transition-all duration-300 hover:scale-[1.015]
                  ${
                    tier.popular
                      ? "bg-amber-400/10 border-amber-400/30 shadow-xl"
                      : "bg-white/5 border-white/10"
                  }
                  ${tier.popular ? tier.glow : ""}
                `}
              >
                <h3 className="text-2xl font-display text-white mb-2">
                  {tier.name}
                </h3>

                <div className="mb-6">
                  <span className="text-5xl font-display text-white">
                    ${tier.price}
                  </span>
                  <span className="text-white/60 text-lg">/month</span>
                </div>

                <p className="text-white/70 mb-6">{tier.description}</p>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-white/90 text-sm md:text-base font-inter">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={`
                    w-full h-12 text-lg font-display rounded-full
                    ${
                      tier.popular
                        ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black hover:from-amber-500 hover:to-orange-600"
                        : tier.crown
                        ? "bg-gradient-to-r from-yellow-400 to-amber-600 text-black"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }
                  `}
                >
                  <Link
                    href={
                      tier.popular
                        ? "/checkout/pro"
                        : tier.crown
                        ? "/checkout/king"
                        : "#"
                    }
                  >
                    {tier.cta}
                    {tier.popular && (
                      <Sparkles className="w-5 h-5 inline-block ml-2" />
                    )}
                    {tier.crown && (
                      <Crown className="w-5 h-5 inline-block ml-2" />
                    )}
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Footer */}
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
            <span className="text-amber-400 ml-2 font-inter">4.9/5</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
