"use client";

import Link from "next/link";

import { usePrefetchRoute } from "@/hooks/usePrefetchRoute";

export default function PillUpgradeLink() {
  const prefetchRoute = usePrefetchRoute();

  return (
    <Link
      href="/pricing"
      prefetch
      className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-black shadow-sm transition-colors hover:bg-emerald-400"
      onMouseEnter={() => prefetchRoute("/pricing")}
      onFocus={() => prefetchRoute("/pricing")}
    >
      Upgrade
    </Link>
  );
}
