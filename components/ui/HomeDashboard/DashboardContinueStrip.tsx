"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { ArrowRight, Plus } from "lucide-react";

import { usePrefetchRoute } from "@/hooks/usePrefetchRoute";
import { cn } from "@/lib/utils";

import { Button } from "../button";
import { DASHBOARD_CARD_GRID } from "./dashboard-layout";

interface DashboardContinueStripProps {
  companionName: string;
  avatarUrl: string;
  continueHref: string;
  showCreate?: boolean;
}

/** Shared box: 32px tall, 1px border, no extra vertical padding. */
const THIN_PILL =
  "box-border h-8 min-h-8 gap-1.5 border px-3.5 py-0 !text-sm font-semibold !leading-none has-[>svg]:px-3.5";

function DashboardContinueStrip({
  companionName,
  avatarUrl,
  continueHref,
  showCreate = false,
}: DashboardContinueStripProps) {
  const prefetchRoute = usePrefetchRoute();

  return (
    <div className={cn(DASHBOARD_CARD_GRID, "mb-3 items-center sm:mb-4")}>
      <div className="col-span-2 flex min-w-0 items-center gap-2">
        <div className="relative size-10 shrink-0 overflow-hidden rounded-xl border border-white/10">
          <Image
            src={avatarUrl}
            alt=""
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <p className="min-w-0 truncate text-base text-white/55">
          Keep going with{" "}
          <span className="font-semibold text-white">{companionName}</span>?
        </p>
        <Button
          asChild
          variant="primary"
          size="sm"
          className={cn(THIN_PILL, "border-0")}
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

      {showCreate ? (
        <Button
          asChild
          variant="secondary"
          size="sm"
          className={cn(THIN_PILL, "w-full justify-center border-white/20")}
        >
          <Link
            href="/new"
            prefetch
            aria-label="Create companion"
            onMouseEnter={() => prefetchRoute("/new")}
            onFocus={() => prefetchRoute("/new")}
            onTouchStart={() => prefetchRoute("/new")}
          >
            <Plus className="size-3.5" />
            Create companion
          </Link>
        </Button>
      ) : null}
    </div>
  );
}

export default memo(DashboardContinueStrip);
