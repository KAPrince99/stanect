"use client";

import { motion } from "framer-motion";

export function PricingBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <motion.div
        className="absolute top-20 -left-32 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl"
        initial={{ opacity: 0.35, x: -12, y: 8 }}
        animate={{ opacity: [0.35, 0.55, 0.35], x: [-12, 10, -12], y: [8, -6, 8] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-0 bottom-10 h-64 w-64 rounded-full bg-orange-500/15 blur-3xl"
        initial={{ opacity: 0.3, x: 10, y: -8 }}
        animate={{ opacity: [0.3, 0.5, 0.3], x: [10, -8, 10], y: [-8, 10, -8] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      />
    </div>
  );
}
