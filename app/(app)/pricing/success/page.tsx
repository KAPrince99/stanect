"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#fbbf24", "#f59e0b", "#ffffff"],
    });

    // Wait 2 seconds for the webhook to finish, then refresh the user data
    const timer = setTimeout(() => {
      router.refresh();
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4 lg:-ml-30">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-2xl p-8 rounded-3xl text-center shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-emerald-500/20 rounded-full">
            <CheckCircle2 className="w-16 h-16 text-emerald-500" />
          </div>
        </div>

        <h1 className="type-display mb-2 text-[1.75rem]">
          Plan unlocked
        </h1>
        <p className="type-body mb-8">
          Your subscription is now active. You have full access to all premium
          features.
        </p>

        <div className="space-y-4">
          <Button
            onClick={() => router.push("/dashboard")}
            className="type-cta flex h-11 w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-amber-400 to-orange-500 text-black transition-opacity hover:opacity-95"
          >
            Go to Dashboard <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
