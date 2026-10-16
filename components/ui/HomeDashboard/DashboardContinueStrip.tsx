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
import { DASHBOARD_CONTINUE_AVATAR_INSET } from "./dashboard-layout";

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
    <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4 sm:gap-6 md:gap-8">
      <div
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2 sm:gap-3",
          DASHBOARD_CONTINUE_AVATAR_INSET,
        )}
      >
        <div className="relative size-10 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={avatarUrl}
            alt=""
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <p className="min-w-0 truncate text-sm text-white/55 sm:text-base">
          Keep going with{" "}
          <span className="font-semibold text-white">{companionName}</span>?
        </p>
        <Button
          asChild
          variant="primary"
          size="sm"
          className={cn(THIN_PILL, "shrink-0 border-0")}
        >
          <Link
            href={continueHref}
            prefetch
            aria-label="Continue convo"
            onMouseEnter={() => prefetchRoute(continueHref)}
            onFocus={() => prefetchRoute(continueHref)}
            onTouchStart={() => prefetchRoute(continueHref)}
          >
            <span className="sm:hidden">Continue</span>
            <span className="hidden sm:inline">Continue convo</span>
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
            CREATE_PILL,
            "max-md:hidden shrink-0 justify-center border-0",
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
