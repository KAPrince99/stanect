"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { Loader2, Clock } from "lucide-react";

import {
  clearPendingPaymentStatus,
  fetchSubscriptionStatus,
} from "@/app/(app)/actions/subs";
import SuccessView from "@/components/payments/SuccessView";
import ErrorView from "@/components/payments/ErrorView";

function StatusContent() {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const status = searchParams.get("status");
  const plan = searchParams.get("plan") || "Pro";
  const clerkUserId = user?.id;
  const isPendingView = status === "pending";

  const [showReset, setShowReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  const { data: subscription } = useQuery({
    queryKey: ["subscription", clerkUserId],
    queryFn: () => fetchSubscriptionStatus(),
    enabled: !!isLoaded && !!clerkUserId && isPendingView,
    refetchInterval: isPendingView ? 3000 : false,
    staleTime: 0,
  });

  useEffect(() => {
    if (!isPendingView) return;
    const timer = setTimeout(() => setShowReset(true), 15000);
    return () => clearTimeout(timer);
  }, [isPendingView]);

  useEffect(() => {
    if (!isPendingView) return;
    if (subscription?.status === "active" && subscription.plan) {
      router.replace(
        `/payment/status?status=success&plan=${subscription.plan}`,
      );
    }
  }, [isPendingView, subscription, router]);

  async function handleReset() {
    try {
      setResetting(true);
      await clearPendingPaymentStatus();
      router.push("/pricing");
    } catch {
      setResetting(false);
    }
  }

  if (status === "success") return <SuccessView planName={plan} />;
  if (status === "failed") return <ErrorView message="Transaction declined." />;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center rounded-3xl border border-white/12 bg-white/[0.06] p-8 text-center backdrop-blur-xl">
      <div className="relative mb-8 rounded-full bg-amber-400/15 p-6">
        <Clock className="h-14 w-14 animate-pulse text-amber-400" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-amber-400/30 border-t-transparent" />
      </div>

      <h1 className="type-display mb-3 text-[1.75rem]">Confirming payment</h1>

      <p className="type-body mb-10">
        Waiting for your bank to confirm. This usually takes a few seconds.
      </p>

      <div className="w-full space-y-4">
        <div className="type-label flex items-center justify-center gap-3 rounded-full border border-amber-400/20 bg-amber-400/10 py-3 text-amber-200">
          <Loader2 className="h-4 w-4 animate-spin" />
          Awaiting confirmation
        </div>

        {showReset && (
          <button
            type="button"
            disabled={resetting}
            onClick={handleReset}
            className="type-meta mx-auto mt-4 block text-red-300 underline disabled:opacity-50"
          >
            {resetting ? "Resetting…" : "Taking too long? Try again."}
          </button>
        )}
      </div>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-20">
      <Suspense fallback={<Loader2 className="animate-spin text-amber-500" />}>
        <StatusContent />
      </Suspense>
    </main>
  );
}
