// /app/payment/callback/page.tsx
// This file does not need "use client" if it only wraps other client components in Suspense
// If you want to keep the "use client" directive for the styling/Loader2 component, that's fine too.
"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import PaymentHandler from "./PaymentHandler"; // Import the new component

// Define a loading fallback for the suspense boundary
const SuspenseFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <Loader2 className="w-8 h-8 animate-spin text-white mb-4" />
    <p className="text-white text-lg font-medium">
      Loading confirmation details...
    </p>
  </div>
);

export default function PaymentCallbackPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* The static parts of your UI */}
      <Loader2 className="w-8 h-8 animate-spin text-white mb-4" />
      <p className="text-white text-lg font-medium">
        Finalizing payment... Do not close this window.
      </p>
      <p className="text-white/70 text-sm mt-2">
        We are waiting for Paystack to confirm your subscription.
      </p>

      {/* Wrap the component that uses useSearchParams in Suspense */}
      <Suspense fallback={<SuspenseFallback />}>
        <PaymentHandler />
      </Suspense>
    </div>
  );
}
