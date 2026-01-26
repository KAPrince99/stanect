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
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white rounded-3xl shadow-xl border border-amber-100 max-w-md mx-auto">
      <div className="bg-amber-50 p-6 rounded-full mb-8 relative">
        <Clock className="w-16 h-16 text-amber-500 animate-pulse" />
        <div className="absolute inset-0 rounded-full border-4 border-amber-200 border-t-transparent animate-spin" />
      </div>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
        Confirming Payment
      </h1>

      <p className="text-gray-500 mb-10 leading-relaxed">
        Waiting for your bank to confirm. This usually takes a few seconds.
      </p>

      <div className="space-y-4 w-full">
        <div className="flex items-center justify-center gap-3 text-sm font-medium text-amber-600 bg-amber-50 py-3 rounded-xl border border-amber-100">
          <Loader2 className="w-4 h-4 animate-spin" />
          Awaiting Network Confirmation
        </div>

        {showReset && (
          <button
            onClick={async () => {
              await performReset();
              router.push("/pricing");
            }}
            className="mt-4 text-sm text-red-500 underline block mx-auto font-medium"
          >
            Taking too long? Click here to try again.
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
