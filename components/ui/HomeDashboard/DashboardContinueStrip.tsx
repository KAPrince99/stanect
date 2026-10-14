"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { ArrowRight } from "lucide-react";

import { lordColors } from "@/lib/brand";
import { usePrefetchRoute } from "@/hooks/usePrefetchRoute";
import { cn } from "@/lib/utils";

import { Button } from "../button";
import LordIcon from "../lordIcon";
import { CREATE_LORD_ICON } from "../sidebar/sidebarNavConfig";
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

/** Create sits at avatar height so it reads a step larger than Continue. */
const CREATE_PILL =
  "box-border h-10 min-h-10 gap-2 border px-4 py-0 !text-sm font-semibold !leading-none";

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
        <div className="relative size-10 shrink-0 overflow-hidden rounded-xl">
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
            Continue convo
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>

      {showCreate ? (
        <Button
          asChild
          variant="secondary"
          size="sm"
          className={cn(CREATE_PILL, "w-full justify-center border-0")}
        >
          <Link
            href="/new"
            prefetch
            aria-label="Create companion"
            onMouseEnter={() => prefetchRoute("/new")}
            onFocus={() => prefetchRoute("/new")}
            onTouchStart={() => prefetchRoute("/new")}
          >
            <LordIcon
              src={CREATE_LORD_ICON}
              trigger="hover"
              colors={lordColors({
                primary: "accent",
                secondary: "white",
                tertiary: "accent",
              })}
              width={22}
              height={22}
            />
            Create companion
          </Link>
        </Button>
      ) : null}
    </div>
  );
}

export default memo(DashboardContinueStrip);
