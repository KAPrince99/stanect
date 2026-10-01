"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { memo } from "react";

import { usePrefetchRoute } from "@/hooks/usePrefetchRoute";
import { cn } from "@/lib/utils";

import { companionPortraitAspect } from "./CompanionOverviewCardMedia";

interface CompanionGhostCardProps {
  index: number;
  className?: string;
}

function CompanionGhostCard({ index, className }: CompanionGhostCardProps) {
  const prefetchRoute = usePrefetchRoute();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.05, duration: 0.28 }}
      className={cn("h-full", className)}
    >
      <Link
        href="/new"
        prefetch
        aria-label="Create another companion"
        className="group flex h-full flex-col outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40"
        onMouseEnter={() => prefetchRoute("/new")}
        onFocus={() => prefetchRoute("/new")}
      >
        <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-dashed border-white/15 bg-white/3 opacity-55 shadow-none transition-all duration-300 group-hover:border-white/25 group-hover:bg-white/6 group-hover:opacity-75">
          <div
            className={cn(
              "relative flex shrink-0 items-center justify-center bg-white/4",
              companionPortraitAspect,
            )}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.06),transparent_65%)]" />
            <div className="relative flex size-12 items-center justify-center rounded-full border border-white/15 bg-white/5 transition-transform duration-300 group-hover:scale-105 sm:size-14">
              <Plus className="size-5 text-white/45 transition-colors group-hover:text-white/70 sm:size-6" />
            </div>
          </div>

          <div className="flex flex-1 flex-col p-3 text-center sm:p-4">
            <p className="type-meta line-clamp-2 text-white/40 group-hover:text-white/55">
              Create another
            </p>
            <div className="mt-auto pt-2.5">
              <div className="h-9 w-full rounded-md bg-white/8 md:h-10" />
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

export default memo(CompanionGhostCard);
