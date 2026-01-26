//@/app/(app)/payment/callback/PaymentHandler.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function PaymentHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasCalled = useRef(false); // Prevents double-calling in StrictMode

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

    // EDGE CASE: Verify status BEFORE redirecting to 'pending'
    // We call our internal API (the one we created earlier) to check status
    // Inside your useEffect in PaymentHandler.tsx
    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `/api/paystack/verify?reference=${reference}`,
        );
        const result = await response.json();

        if (result.data.status === "success") {
          toast.success("Payment confirmed!");
          // Redirect to your custom success page
          router.push(
            `/payment/status?status=success&plan=${result.data.metadata.plan}`,
          );
        } else {
          // Redirect to your custom error page
          router.push("/payment/status?status=failed");
        }
      } catch (error) {
        // If verification hits a network error, we fallback to the pending state
        router.push("/payment/status?status=pending");
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return null;
}
