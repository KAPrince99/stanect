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
      className="flex flex-col items-center justify-center py-5 lg:-ml-35"
    >
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="mb-10"
      >
        <LordIcon
          src="https://cdn.lordicon.com/opeotjej.json"
          trigger="loop"
          colors="primary:#e88c30,secondary:#e88c30,tertiary:#ebe6ef,quaternary:#e88c30"
          height={150}
          width={150}
        />
      </motion.div>

      <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
        No companions yet.
      </h2>
      <p className="text-white/70 text-lg mb-10 max-w-md text-center">
        Time to create someone who makes your heart race
      </p>

      <Link href="/new">
        <Button
          size="lg"
          className="h-12 px-10 text-xl font-bold bg-linear-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black shadow-2xl shadow-amber-500/50 cursor-pointer"
        >
          <LordIcon
            src="https://cdn.lordicon.com/ueoydrft.json"
            trigger="loop"
            colors="primary:#e88c30,secondary:#ffffff,tertiary:#e88c30"
            width={35}
            height={35}
          />
          Create Your First
          <Sparkles className="w-6 h-6 ml-3" />
        </Button>
      </Link>
    </motion.div>
  );
}
