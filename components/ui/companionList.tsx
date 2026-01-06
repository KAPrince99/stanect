"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { getCompanions } from "@/app/(app)/actions/actions";
import { useUser } from "@clerk/nextjs";
import CompanionCard from "./companionCard";
import Fresh from "./Fresh";
import LoadingSpinner from "./LoadingSpinner";

export default function CompanionList({ userId }: { userId: string }) {
  const { user } = useUser();

  const { data: companions = [], isLoading } = useQuery({
    queryKey: ["companions", userId],
    queryFn: () => getCompanions(userId),
    enabled: !!user,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="relative px-6 py-20 md:py-25 md:px-10 lg:px-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-5 md:mb-10"
      >
        <h1 className="text-3xl md:text-5xl tracking-tight bg-linear-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
          Welcome back, {user?.firstName || "King"}.
        </h1>
        <p className="mt-4 text-white/70 text-md md:text-lg font-inter">
          {companions.length === 0
            ? "Your confidence journey starts now"
            : `You have ${companions.length} ${
                companions.length === 1 ? "companion" : "companions"
              } waiting`}
        </p>
      </motion.div>

      {/* Empty State */}
      {companions.length === 0 && <Fresh />}

      {/* Companions Grid */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto"
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
      </AnimatePresence>
    </div>
  );
}
