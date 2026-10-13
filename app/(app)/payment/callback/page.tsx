"use client";

import { Suspense } from "react";

import { PaymentCallbackSkeleton } from "@/components/payments/PaymentSkeleton";

import PaymentHandler from "./PaymentHandler";

export default function PaymentCallbackPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-backdrop-from via-backdrop-via to-backdrop-to p-6 text-white">
      <Suspense fallback={<PaymentCallbackSkeleton />}>
        <PaymentHandler />
      </Suspense>
    </div>
  );
}
