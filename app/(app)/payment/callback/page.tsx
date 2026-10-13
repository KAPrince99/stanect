//@/app/(app)/payment/callback/page.tsx
"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import PaymentHandler from "./PaymentHandler";

const SuspenseFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
    <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
    <p className="text-lg font-medium">Initializing secure verification...</p>
  </div>
);

export default function PaymentCallbackPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-backdrop-from via-backdrop-via to-backdrop-to p-6 text-white">
      <Suspense fallback={<SuspenseFallback />}>
        <PaymentHandler />
      </Suspense>
    </div>
  );
}
