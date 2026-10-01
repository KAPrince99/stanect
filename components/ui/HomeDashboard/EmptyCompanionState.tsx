"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Loader2, MoveRight, Sparkles } from "lucide-react";

import LordIcon from "../lordIcon";
import { Button } from "../button";
import { motionTransition, motionVariants } from "@/lib/motion";

interface EmptyCompanionStateProps {
  onStartSetup: () => void;
  isPending?: boolean;
}

function EmptyCompanionState({
  onStartSetup,
  isPending = false,
}: EmptyCompanionStateProps) {
  return (
    <motion.div
      variants={motionVariants.fadeUp}
      initial="hidden"
      animate="visible"
      transition={motionTransition.soft}
      className="flex flex-col items-center justify-center"
    >
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-center shadow-xl backdrop-blur-xl md:px-10 md:py-12">
        <div className="type-meta mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/10 px-4 py-1.5 uppercase tracking-wide text-amber-300">
          <Sparkles className="h-3.5 w-3.5" />
          New Companion Setup
        </div>

        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 3.6, ease: "easeInOut" }}
          className="mb-4"
        >
          <LordIcon
            src="https://cdn.lordicon.com/opeotjej.json"
            trigger="loop"
            colors="primary:#e88c30,secondary:#e88c30,tertiary:#ebe6ef,quaternary:#e88c30"
            height={120}
            width={120}
          />
        </motion.div>

        <h2 className="type-display">Create your first companion</h2>

        <p className="type-body mx-auto mt-3 max-w-xl">
          Build a personalized AI companion with your preferred voice, scene,
          and style in a guided setup.
        </p>

        <div className="mt-8">
          <Button
            type="button"
            className="type-cta h-auto min-h-12 w-full whitespace-normal bg-linear-to-r from-amber-400 to-orange-500 px-4 text-black shadow-2xl shadow-amber-500/40 hover:from-amber-500 hover:to-orange-600 has-[>svg]:px-4 sm:h-12 sm:w-auto sm:whitespace-nowrap sm:px-8 sm:has-[>svg]:px-8 md:px-10 md:has-[>svg]:px-10"
            onClick={onStartSetup}
            disabled={isPending}
          >
            Start Companion Setup
            {isPending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <MoveRight className="size-5" />
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(EmptyCompanionState);
