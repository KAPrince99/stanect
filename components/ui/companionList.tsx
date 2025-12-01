// components/dashboard/dashboard-content.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

import { getCompanions } from "@/app/(app)/actions/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Sparkles, Heart, Plus } from "lucide-react";
import CompanionCard from "./companionCard";
import LordIcon from "./lordIcon";

export default function CompanionList({ userId }: { userId: string }) {
  const { user } = useUser();

  const { data: companions = [], isLoading } = useQuery({
    queryKey: ["companions", userId],
    queryFn: () => getCompanions(userId),
  });

  if (isLoading) return null;

  return (
    <div className="relative min-h-screen px-6 py-20 md:px-10 lg:px-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-7xl tracking-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
          Welcome back, {user?.firstName || "King"}.
        </h1>
        <p className="mt-4 text-white/70 text-lg md:text-xl font-inter">
          {companions.length === 0
            ? "Your confidence journey starts now"
            : `You have ${companions.length} ${
                companions.length === 1 ? "companion" : "companions"
              } waiting`}
        </p>
      </motion.div>

      {/* Empty State */}
      {companions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="mb-10"
          >
            <Sparkles className="w-24 h-24 text-amber-400" />
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            No companions yet
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-md text-center">
            Time to create someone who makes your heart race
          </p>

          <Link href="/new">
            <Button
              size="lg"
              className="h-16 px-10 text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black shadow-2xl shadow-amber-500/50 cursor-pointer"
            >
              <LordIcon
                src="https://cdn.lordicon.com/ueoydrft.json"
                trigger="loop"
                colors="primary:#e88c30,secondary:#ffffff,tertiary:#e88c30"
                width={45}
                height={45}
              />
              Create Your First
              <Sparkles className="w-6 h-6 ml-3" />
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Companions Grid */}
      <AnimatePresence>
        {companions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto"
          >
            {companions.map((companion, i) => (
              <motion.div
                key={companion.id}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <CompanionCard companion={companion} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating CTA (always visible on mobile) */}
      <Link href="/new">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-2xl flex items-center justify-center hidden "
        >
          <Plus className="w-8 h-8 text-black" />
        </motion.button>
      </Link>
    </div>
  );
}
