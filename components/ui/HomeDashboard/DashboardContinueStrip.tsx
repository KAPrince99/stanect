"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { ArrowRight, Plus } from "lucide-react";

import { usePrefetchRoute } from "@/hooks/usePrefetchRoute";
import { cn } from "@/lib/utils";

import { Button } from "../button";

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
    <div className="mb-3 flex w-full items-center gap-2 sm:mb-4">
      <div className="flex min-w-0 items-center gap-2">
        <div className="relative size-8 shrink-0 overflow-hidden rounded-full border border-white/10">
          <Image
            src={avatarUrl}
            alt=""
            fill
            className="object-cover"
            sizes="32px"
          />
        </div>
        <p className="min-w-0 truncate text-base font-medium text-white">
          {companionName}
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
          className={cn(
            THIN_PILL,
            "ml-auto w-8 shrink-0 border-white/20 px-0 has-[>svg]:px-0 sm:w-auto sm:px-3.5 sm:has-[>svg]:px-3.5",
          )}
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
            <span className="hidden sm:inline">Create companion</span>
          </Link>
        </Button>
      ) : (
        <span className="ml-auto" />
      )}
    </div>
  );
}

export default memo(DashboardContinueStrip);
