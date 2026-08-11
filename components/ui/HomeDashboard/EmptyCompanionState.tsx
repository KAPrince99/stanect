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
    <div className="mx-auto max-w-5xl">
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

          <h2 className="type-display text-[1.5rem] sm:text-[1.875rem]">
            Create your first companion
          </h2>

          <p className="type-body mx-auto mt-3 max-w-xl">
            Build a personalized AI companion with your preferred voice, scene,
            and style in a guided setup.
          </p>

          <div className="mt-8">
            <Button
              type="button"
              size="lg"
              className="type-cta h-12 cursor-pointer bg-linear-to-r from-amber-400 to-orange-500 px-8 text-black shadow-2xl shadow-amber-500/40 hover:from-amber-500 hover:to-orange-600 md:px-10"
              onClick={onStartSetup}
              disabled={isPending}
            >
              Start Companion Setup
              {isPending ? (
                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
              ) : (
                <MoveRight className="ml-2 h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default memo(EmptyCompanionState);
