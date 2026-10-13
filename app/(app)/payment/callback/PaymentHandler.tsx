"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const VERIFY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 400;
const PENDING_STATUSES = new Set([
  "pending",
  "ongoing",
  "processing",
  "queued",
]);

type PaystackOutcome = "success" | "pending" | "failed";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readVerification(reference: string): Promise<{
  outcome: PaystackOutcome;
  plan?: string;
}> {
  const response = await fetch(
    `/api/paystack/verify?reference=${encodeURIComponent(reference)}`,
  );
  const result = await response.json().catch(() => null);
  const status = result?.data?.status;

  if (status === "success") {
    return { outcome: "success", plan: result.data.metadata?.plan };
  }
  if (typeof status === "string" && PENDING_STATUSES.has(status)) {
    return { outcome: "pending" };
  }
  if (typeof status === "string") return { outcome: "failed" };
  if (!response.ok && response.status < 500) return { outcome: "failed" };

  throw new Error("Verification unreachable");
}

function Verifying() {
  return (
    <div className="flex max-w-sm flex-col items-center text-center">
      <div className="relative mb-6">
        <Loader2 className="h-16 w-16 animate-spin text-indigo-500" />
        <ShieldCheck className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-indigo-400" />
      </div>

      <h1 className="mb-2 text-2xl font-bold">Verifying Transaction</h1>
      <p className="text-sm leading-relaxed text-slate-400">
        We&apos;re communicating with Paystack to secure your subscription.
        <span className="mt-1 block font-semibold text-indigo-400">
          Please do not refresh or close this tab.
        </span>
      </p>
    </div>
  );
}

function Unconfirmed({
  checking,
  onCheckAgain,
}: {
  checking: boolean;
  onCheckAgain: () => void;
}) {
  return (
    <div className="flex max-w-sm flex-col items-center text-center">
      <h1 className="mb-2 text-2xl font-bold">
        We couldn&apos;t confirm this payment
      </h1>
      <p className="text-sm leading-relaxed text-slate-400">
        We couldn&apos;t reach Paystack to confirm this charge. It may still
        have gone through.
      </p>
      <button
        type="button"
        onClick={onCheckAgain}
        disabled={checking}
        className="mt-6 w-full rounded-full bg-indigo-500 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {checking ? "Checking…" : "Check again"}
      </button>
      <Link href="/pricing" className="mt-3 text-sm text-indigo-300 underline">
        Back to pricing
      </Link>
    </div>
  );
}

export default function PaymentHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasCalled = useRef(false);
  const mountedRef = useRef(true);
  const runningRef = useRef(false);
  const referenceRef = useRef<string | null>(null);
  const [phase, setPhase] = useState<"verifying" | "unconfirmed">("verifying");
  const [checking, setChecking] = useState(false);

  const redirectFor = useCallback(
    (outcome: PaystackOutcome, plan?: string) => {
      if (outcome === "success") {
        toast.success("Payment confirmed!");
        router.push(`/payment/status?status=success&plan=${plan}`);
        return;
      }

      if (outcome === "pending") {
        router.push("/payment/status?status=pending");
        return;
      }

      router.push("/payment/status?status=failed");
    },
    [router],
  );

  const verifyWithRetries = useCallback(
    async (reference: string, manual = false) => {
      if (runningRef.current) return;
      runningRef.current = true;
      if (manual) setChecking(true);
      else if (mountedRef.current) setPhase("verifying");

      try {
        for (let attempt = 1; attempt <= VERIFY_ATTEMPTS; attempt += 1) {
          try {
            const { outcome, plan } = await readVerification(reference);
            if (!mountedRef.current) return;
            redirectFor(outcome, plan);
            return;
          } catch {
            if (attempt === VERIFY_ATTEMPTS) {
              if (mountedRef.current) setPhase("unconfirmed");
              return;
            }
            await wait(RETRY_DELAY_MS);
            if (!mountedRef.current) return;
          }
        }
      } finally {
        runningRef.current = false;
        if (mountedRef.current) setChecking(false);
      }
    },
    [redirectFor],
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    const reference =
      searchParams.get("reference") || searchParams.get("trxref");

    if (!reference) {
      toast.error("No payment reference found.");
      router.push("/pricing");
      return;
    }

    referenceRef.current = reference;
    void verifyWithRetries(reference);
  }, [router, searchParams, verifyWithRetries]);

  if (phase === "unconfirmed") {
    return (
      <Unconfirmed
        checking={checking}
        onCheckAgain={() => {
          const reference = referenceRef.current;
          if (reference) void verifyWithRetries(reference, true);
        }}
      />
    );
  }

  return <Verifying />;
}
