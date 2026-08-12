"use client";

import React, { memo } from "react";
import { MoveLeft, MoveRight } from "lucide-react";
import { motion } from "framer-motion";

import { motionVariants } from "@/lib/motion";

import { Button } from "../button";

interface TabNavigationProps {
  onPrevClick: () => void;
  onNextClick: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

function TabNavigation({
  onPrevClick,
  onNextClick,
  canGoPrev,
  canGoNext,
}: TabNavigationProps) {
  return (
    <motion.section
      variants={motionVariants.fadeUp}
      initial="hidden"
      animate="visible"
      className="my-8 flex justify-end gap-3"
    >
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-11 rounded-full border border-white/10 bg-white/8 text-white backdrop-blur-md hover:bg-white/10"
        onClick={onPrevClick}
        disabled={!canGoPrev}
        aria-label="Go to previous tab"
      >
        <MoveLeft className="h-5 w-5" />
      </Button>

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-11 rounded-full border border-white/10 bg-white/8 text-white backdrop-blur-md hover:bg-white/10"
        onClick={onNextClick}
        disabled={!canGoNext}
        aria-label="Go to next tab"
      >
        <MoveRight className="h-5 w-5" />
      </Button>
    </motion.section>
  );
}

export default memo(TabNavigation);
