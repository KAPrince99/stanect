import { PaymentStatusSkeleton } from "@/components/payments/PaymentSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-20">
      <PaymentStatusSkeleton />
    </main>
  );
}
