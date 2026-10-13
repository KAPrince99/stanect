import { PaymentCallbackSkeleton } from "@/components/payments/PaymentSkeleton";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-backdrop-from via-backdrop-via to-backdrop-to p-6 text-white">
      <PaymentCallbackSkeleton />
    </div>
  );
}
