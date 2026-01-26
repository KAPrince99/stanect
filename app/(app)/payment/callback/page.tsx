//@/app/(app)/payment/callback/page.tsx
"use client";

import { Suspense } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import PaymentHandler from "./PaymentHandler";

const SuspenseFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
    <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
    <p className="text-lg font-medium">Initializing secure verification...</p>
  </div>
);

export default function PaymentCallbackPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-[#0b1a36] via-[#1a3a80] to-[#1e4ea8] text-white p-6">
      <div className="flex flex-col items-center max-w-sm text-center">
        <div className="relative mb-6">
          <Loader2 className="w-16 h-16 animate-spin text-indigo-500" />
          <ShieldCheck className="w-6 h-6 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Verifying Transaction</h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          We're communicating with Paystack to secure your subscription.
          <span className="block mt-1 font-semibold text-indigo-400">
            Please do not refresh or close this tab.
          </span>
        </p>

        {/* Hidden logic handler */}
        <Suspense fallback={<SuspenseFallback />}>
          <PaymentHandler />
        </Suspense>
      </div>
    </div>
  );
}
