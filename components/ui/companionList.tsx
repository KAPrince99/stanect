"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { getCompanions } from "@/app/(app)/actions/actions";
import { useUser } from "@clerk/nextjs";
import CompanionCard from "./companionCard";
import Fresh from "./Fresh";
import LoadingSpinner from "./LoadingSpinner";

export default function CompanionList({ userId }: { userId: string }) {
  const { user, isLoaded: userLoaded } = useUser();

  const { data: companions = [], isLoading } = useQuery({
    queryKey: ["companions", userId],
    queryFn: () => getCompanions(userId),
    enabled: !!userId && userLoaded,
    staleTime: 1000 * 60 * 5,
  });

  if (!userLoaded || isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative px-6 py-25 md:px-10 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl md:text-5xl tracking-tight bg-linear-to-r from-white via-white to-white/70 bg-clip-text text-transparent lg:-ml-35">
          Welcome back, {user?.firstName || "King"}.
        </h1>
        <p className="mt-4 text-white/70 text-md md:text-lg lg:-ml-35">
          {companions.length === 0
            ? "Your confidence journey starts now"
            : `You have ${companions.length} ${companions.length === 1 ? "companion" : "companions"} waiting`}
        </p>
      </motion.div>

      {companions.length === 0 ? (
        <Fresh />
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {companions.map((companion, i) => (
              <motion.div
                key={companion.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                transition={{ delay: i * 0.05 }}
              >
                <CompanionCard companion={companion} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
