//@/app/(app)/payment/status/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { Loader2, Clock } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import SuccessView from "@/components/payments/SuccessView";
import ErrorView from "@/components/payments/ErrorView";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

function StatusContent() {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const status = searchParams.get("status");
  const plan = searchParams.get("plan") || "Pro";
  const clerk_user_id = user?.id;

  const [showReset, setShowReset] = useState(false);

  // --- 1. THE RESET LOGIC ---
  // Memoized so it can be used in multiple effects without re-triggering
  const performReset = useCallback(async () => {
    if (!clerk_user_id) return;
    console.log("Auto-resetting pending status...");
    await supabase
      .from("users")
      .update({ status: null })
      .eq("clerk_user_id", clerk_user_id);
  }, [clerk_user_id]);

  // --- 2. THE "NO REFRESH" BACK BUTTON DETECTOR ---
  useEffect(() => {
    if (status !== "pending") return;

    const handleBackButton = () => {
      // This fires the moment the back button is pressed
      performReset();
    };

    // Listen for browser back/forward navigation
    window.addEventListener("popstate", handleBackButton);

    // Cleanup: If they leave the page by clicking a link instead of the back button
    return () => {
      window.removeEventListener("popstate", handleBackButton);
      if (status === "pending") {
        performReset();
      }
    };
  }, [status, performReset]);

  // --- 3. SHOW MANUAL RESET AFTER 15 SECONDS ---
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "pending") {
      timer = setTimeout(() => setShowReset(true), 15000);
    }
    return () => clearTimeout(timer);
  }, [status]);

  // --- 4. REALTIME & POLLING LOGIC ---
  useEffect(() => {
    if (!isLoaded || !clerk_user_id || status !== "pending") return;

    const checkCurrentStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("status, plan")
          .eq("clerk_user_id", clerk_user_id)
          .single();

        if (data?.status === "active") {
          router.push(`/payment/status?status=success&plan=${data.plan}`);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };

    checkCurrentStatus();

    const channel = supabase
      .channel(`status-sync-${clerk_user_id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: `clerk_user_id=eq.${clerk_user_id}`,
        },
        (payload) => {
          if (payload.new.status === "active") {
            router.push(
              `/payment/status?status=success&plan=${payload.new.plan}`,
            );
          }
        },
      )
      .subscribe();

    const polling = setInterval(checkCurrentStatus, 3000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(polling);
    };
  }, [isLoaded, clerk_user_id, status, router]);

  // --- Views ---
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
            onClick={async () => {
              await performReset();
              router.push("/pricing");
            }}
            className="type-meta mx-auto mt-4 block text-red-300 underline"
          >
            Taking too long? Try again.
          </button>
        )}
      </div>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <main className="max-w-4xl mx-auto py-20 px-4 flex items-center justify-center min-h-screen">
      <Suspense fallback={<Loader2 className="animate-spin text-amber-500" />}>
        <StatusContent />
      </Suspense>
    </main>
  );
}
