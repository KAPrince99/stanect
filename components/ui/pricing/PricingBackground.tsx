import { motion } from "framer-motion";

export function PricingBackground() {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0"
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 0.7 }}
      transition={{ duration: 4 }}
    >
      <div className="absolute top-20 -left-32 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute right-0 bottom-10 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl" />
    </motion.div>
  );
}
