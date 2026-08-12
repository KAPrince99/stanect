"use client";

import { ShieldAlert, Clock, Zap, RefreshCw } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface ConvoGuardProps {
  reason: "trial_expired" | "daily_limit_reached" | "check_failed";
  plan?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export default function ConvoGuard({
  reason,
  onRetry,
  isRetrying = false,
}: ConvoGuardProps) {
  const isTrial = reason === "trial_expired";
  const isCheckFailed = reason === "check_failed";

  const title = isCheckFailed
    ? "Couldn't verify access"
    : isTrial
      ? "Trial period ended"
      : "Daily limit reached";

  const body = isCheckFailed
    ? "We couldn't confirm your plan or talk credit right now. Retry before starting a call."
    : isTrial
      ? "Your 7-day exploration of Stanect has finished. Upgrade to Pro to keep practicing."
      : "You've used your free daily talk credit. Conversations reset every 24 hours.";

  return (
    <div className="flex w-full flex-1 items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-xl md:p-12">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-amber-500/50 bg-amber-500/20">
          {isCheckFailed ? (
            <RefreshCw className="h-10 w-10 text-amber-500" />
          ) : isTrial ? (
            <ShieldAlert className="h-10 w-10 text-amber-500" />
          ) : (
            <Clock className="h-10 w-10 text-amber-500" />
          )}
        </div>

        <h1 className="type-display mb-4 text-[1.75rem]">{title}</h1>
        <p className="type-body mb-8 text-white/70">{body}</p>

        <div className="flex flex-col gap-3">
          {isCheckFailed && onRetry ? (
            <Button
              type="button"
              onClick={onRetry}
              disabled={isRetrying}
              className="type-cta h-12 bg-linear-to-r from-amber-400 to-orange-500 text-black shadow-lg shadow-orange-500/20"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isRetrying ? "animate-spin" : ""}`}
              />
              {isRetrying ? "Checking…" : "Try again"}
            </Button>
          ) : (
            <Button
              asChild
              className="type-cta h-12 bg-linear-to-r from-amber-400 to-orange-500 text-black shadow-lg shadow-orange-500/20"
            >
              <Link
                href="/pricing"
                className="flex items-center justify-center gap-2"
              >
                <Zap className="h-4 w-4 fill-current" />
                Upgrade to Pro
              </Link>
            </Button>
          )}

          <Button
            asChild
            variant="ghost"
            className="type-label text-white/50 hover:bg-white/5 hover:text-white"
          >
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
