"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { memo } from "react";

import { motionVariants } from "@/lib/motion";

import ConvoActionBar from "./ConvoActionBar";
import { useConvoStage } from "./ConvoStageContext";
import ConvoStatusHero, { ConvoStatusBadge } from "./ConvoStatusHero";
import SessionEndedModal from "./sessionEndedModal";
import {
  MobileTranscriptOverlay,
  TranscriptPanel,
} from "./TranscriptBlock";

function ConvoPresenter() {
  const {
    companionId,
    companionName,
    companionScene,
    backAction,
    deleteAction,
  } = useConvoStage();
  const scene = companionScene?.trim();

  return (
    <div className="relative flex h-full min-h-0 w-full flex-1 flex-col">
      <motion.main
        variants={motionVariants.fadeUp}
        initial={false}
        animate="visible"
        className="relative grid h-full min-h-0 w-full flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)] overflow-hidden text-white md:rounded-3xl md:border md:border-white/10 md:bg-white/5 md:shadow-2xl md:backdrop-blur-xl lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_24rem]"
      >
        <div className="relative z-10 flex h-full min-h-0 w-full flex-col items-center overflow-hidden px-2 pt-12 sm:pt-14">
          {backAction ? (
            <div className="absolute top-3 left-3 z-20 sm:top-4 sm:left-4 lg:hidden">
              {backAction}
            </div>
          ) : null}

          {scene ? (
            // Same top line and height as Delete and Ready (top-3/4, h-9).
            <div className="pointer-events-none absolute top-3 right-24 left-16 z-20 hidden h-9 items-center sm:top-4 sm:right-28 sm:left-[4.5rem] sm:flex lg:left-4">
              <span
                title={scene}
                className="pointer-events-auto flex min-w-0 items-center gap-1.5 text-sm font-medium type-meta text-white/65"
              >
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate capitalize">{scene}</span>
              </span>
            </div>
          ) : null}

          <div
            data-convo-chrome="status"
            className="absolute top-3 left-1/2 z-20 flex h-9 -translate-x-1/2 items-center sm:top-4"
          >
            <ConvoStatusBadge />
          </div>

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
