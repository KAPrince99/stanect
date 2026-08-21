"use client";

import { motion } from "framer-motion";
import { memo } from "react";

import { motionVariants } from "@/lib/motion";

import ConvoActionBar from "./ConvoActionBar";
import { useConvoStage } from "./ConvoStageContext";
import ConvoStatusHero from "./ConvoStatusHero";
import SessionEndedModal from "./sessionEndedModal";
import {
  MobileTranscriptOverlay,
  TranscriptPanel,
} from "./TranscriptBlock";

function ConvoPresenter() {
  const { companionId, companionName, backAction, deleteAction } =
    useConvoStage();

  return (
    <div className="relative flex h-full min-h-0 w-full flex-1 flex-col">
      <motion.main
        variants={motionVariants.fadeUp}
        initial="hidden"
        animate="visible"
        className="relative grid h-full min-h-0 w-full flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)] overflow-hidden text-white md:rounded-3xl md:border md:border-white/10 md:bg-white/5 md:shadow-2xl md:backdrop-blur-xl lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_24rem]"
      >
        <div className="relative z-10 flex h-full min-h-0 w-full flex-col items-center justify-between px-2">
          {backAction ? (
            <div className="absolute top-3 left-3 z-20 sm:top-4 sm:left-4">
              {backAction}
            </div>
          ) : null}

          {deleteAction ? (
            <div className="absolute top-3 right-3 z-20 sm:top-4 sm:right-4">
              {deleteAction}
            </div>
          ) : null}

          <ConvoStatusHero />
          <ConvoActionBar />
        </div>

        <div className="hidden h-full min-h-0 border-l border-white/10 lg:block">
          <TranscriptPanel
            companionId={companionId}
            companionName={companionName}
          />
        </div>
      </motion.main>

      <MobileTranscriptOverlay />
      <SessionEndedModal />
    </div>
  );
}

export default memo(ConvoPresenter);
