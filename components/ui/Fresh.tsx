import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "./button";
import LordIcon from "./lordIcon";

export default function Fresh() {
  return (
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
  );
}
