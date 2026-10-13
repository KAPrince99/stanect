import { Pulse } from "@/components/ui/Pulse";

export function PaymentCallbackSkeleton() {
  return (
    <div
      className="flex max-w-sm flex-col items-center text-center"
      role="status"
      aria-label="Verifying payment"
    >
      <div className="relative mb-6">
        <Pulse className="h-16 w-16" />
      </div>
      <Pulse className="mb-2 h-8 w-64 max-w-full rounded-md" />
      <Pulse className="h-4 w-full" />
      <Pulse className="mt-1 h-4 w-5/6" />
      <Pulse className="mt-1 h-4 w-56 max-w-full bg-amber-400/25" />
      <span className="sr-only">Verifying payment…</span>
    </div>
  );
}

export function PaymentStatusSkeleton() {
  return (
    <div
      className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center rounded-3xl border border-white/12 bg-white/[0.06] p-8 text-center backdrop-blur-xl"
      role="status"
      aria-label="Loading payment status"
    >
      <div className="relative mb-8 rounded-full bg-amber-400/15 p-6">
        <Pulse className="h-14 w-14" />
      </div>
      <Pulse className="mb-3 h-8 w-56 max-w-full rounded-md" />
      <div className="mb-10 w-full space-y-2">
        <Pulse className="mx-auto h-4 w-full" />
        <Pulse className="mx-auto h-4 w-5/6" />
      </div>
      <Pulse className="h-12 w-full rounded-full border border-amber-400/20 bg-amber-400/10" />
      <span className="sr-only">Loading payment status…</span>
    </div>
  );
}

export function PricingSuccessSkeleton() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-transparent px-4 lg:-ml-30"
      role="status"
      aria-label="Loading plan unlock"
    >
      <div className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-2xl p-8 rounded-3xl text-center shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-emerald-500/20 rounded-full">
            <Pulse className="h-16 w-16" />
          </div>
        </div>
        <Pulse className="mx-auto mb-2 h-8 w-48 rounded-md" />
        <div className="mb-8 space-y-2">
          <Pulse className="mx-auto h-4 w-full" />
          <Pulse className="mx-auto h-4 w-5/6" />
        </div>
        <Pulse className="h-11 w-full rounded-full bg-amber-400/25" />
      </div>
      <span className="sr-only">Loading plan unlock…</span>
    </div>
  );
}
