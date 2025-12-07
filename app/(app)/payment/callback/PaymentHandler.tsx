// /app/payment/callback/PaymentHandler.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function PaymentHandler() {
  const router = useRouter();
  // This hook is now encapsulated within a component that is wrapped in <Suspense>
  const searchParams = useSearchParams();

  useEffect(() => {
    const reference =
      searchParams.get("reference") || searchParams.get("trxref");

    if (!reference) {
      toast.error(
        "Payment reference missing. You might need to contact support."
      );
      // Optional: redirect home or back to pricing after error toast
      router.push("/pricing");
      return;
    }

    toast.info("Payment received! Waiting for Paystack confirmation...");

    // Redirect to the pricing page (or dashboard) where the Supabase Realtime
    // listener will catch the 'status' change from 'pending' to 'active'.
    setTimeout(() => {
      router.push("/pricing?status=pending");
    }, 500);
  }, [searchParams, router]);

  // This component renders nothing itself; it just runs the side effect/redirect
  return null;
}
