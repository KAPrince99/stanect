"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import { memo } from "react";

import { motionTransition, motionVariants } from "@/lib/motion";
import { usePrefetchRoute } from "@/hooks/usePrefetchRoute";

import { Button } from "../button";

interface DashboardContinueStripProps {
  companionName: string;
  scene: string;
  durationLabel: string;
  avatarUrl: string;
  continueHref: string;
  welcomeName?: string;
  showCreate?: boolean;
}

function DashboardContinueStrip({
  companionName,
  scene,
  durationLabel,
  avatarUrl,
  continueHref,
  welcomeName,
  showCreate = false,
}: DashboardContinueStripProps) {
  const prefetchRoute = usePrefetchRoute();

  return (
    <motion.div
      variants={motionVariants.fadeUp}
      initial="hidden"
      animate="visible"
      transition={motionTransition.soft}
      className="mb-5 w-full sm:mb-6"
    >
      {welcomeName ? (
        <p className="type-meta mb-2 text-white/40">
          Welcome back, {welcomeName}
        </p>
      ) : null}

      <div className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur-xl sm:gap-4 sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative size-11 shrink-0 overflow-hidden rounded-xl border border-white/10">
            <Image
              src={avatarUrl}
              alt={companionName}
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>

          <div className="min-w-0">
            <p className="type-meta text-[0.6875rem] leading-none text-white/40">
              Continue practice
            </p>
            <h1 className="type-title truncate text-base leading-tight text-white sm:text-md">
              {companionName}
            </h1>
            <p className="type-meta truncate leading-tight capitalize text-white/50">
              {scene}
              {scene && durationLabel ? " · " : null}
              {durationLabel}
            </p>
          </div>

          <Button
            asChild
            className="type-cta hidden h-9 shrink-0 rounded-full bg-linear-to-r from-amber-400 to-orange-500 px-4 text-sm text-black shadow-md shadow-amber-500/20 hover:from-amber-500 hover:to-orange-600 sm:inline-flex"
          >
            <Link
              href={continueHref}
              prefetch
              onMouseEnter={() => prefetchRoute(continueHref)}
              onFocus={() => prefetchRoute(continueHref)}
              onTouchStart={() => prefetchRoute(continueHref)}
            >
              Continue
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Button
            asChild
            className="type-cta inline-flex h-9 rounded-full bg-linear-to-r from-amber-400 to-orange-500 px-4 text-sm text-black shadow-md shadow-amber-500/20 hover:from-amber-500 hover:to-orange-600 sm:hidden"
          >
            <Link
              href={continueHref}
              prefetch
              onMouseEnter={() => prefetchRoute(continueHref)}
              onFocus={() => prefetchRoute(continueHref)}
              onTouchStart={() => prefetchRoute(continueHref)}
            >
              Continue
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>

          {showCreate ? (
            <Link
              href="/new"
              prefetch
              className="type-cta hidden h-9 items-center justify-center gap-1 rounded-full border border-white/15 bg-white/8 px-3.5 text-sm text-white/80 transition hover:border-amber-400/35 hover:bg-white/12 hover:text-white sm:inline-flex"
              onMouseEnter={() => prefetchRoute("/new")}
              onFocus={() => prefetchRoute("/new")}
              onTouchStart={() => prefetchRoute("/new")}
            >
              <Plus className="size-3.5" />
              Create companion
            </Link>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

export default memo(DashboardContinueStrip);
