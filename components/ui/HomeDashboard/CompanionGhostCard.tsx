"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { memo } from "react";

import { usePrefetchRoute } from "@/hooks/usePrefetchRoute";

interface CompanionGhostCardProps {
  index: number;
}

function CompanionGhostCard({ index }: CompanionGhostCardProps) {
  const prefetchRoute = usePrefetchRoute();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.05, duration: 0.28 }}
    >
      <Link
        href="/new"
        prefetch
        aria-label="Create another companion"
        className="group block outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40"
        onMouseEnter={() => prefetchRoute("/new")}
        onFocus={() => prefetchRoute("/new")}
      >
        <article className="relative overflow-hidden rounded-3xl border border-dashed border-white/15 bg-white/[0.03] opacity-55 shadow-none transition-all duration-300 group-hover:border-white/25 group-hover:bg-white/[0.06] group-hover:opacity-75">
          <div className="relative flex aspect-square items-center justify-center bg-white/[0.04]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.06),transparent_65%)]" />
            <div className="relative flex size-14 items-center justify-center rounded-full border border-white/15 bg-white/5 transition-transform duration-300 group-hover:scale-105">
              <Plus className="size-6 text-white/45 transition-colors group-hover:text-white/70" />
            </div>
          </div>

          <div className="space-y-2.5 p-3.5 text-center sm:p-4">
            <div className="mx-auto h-4 w-28 rounded-full bg-white/10" />
            <div className="mx-auto h-9 w-full rounded-md bg-white/8 md:h-10" />
            <p className="type-meta pt-0.5 text-white/40 group-hover:text-white/55">
              Create another
            </p>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

export default memo(CompanionGhostCard);
