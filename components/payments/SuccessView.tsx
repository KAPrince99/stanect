import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";

export default function SuccessView({ planName }: { planName: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-3xl border border-white/12 bg-white/[0.06] p-8 text-center backdrop-blur-xl">
      <div className="mb-6 rounded-full bg-emerald-500/20 p-4">
        <CheckCircleIcon className="h-14 w-14 text-emerald-400" />
      </div>
      <h1 className="type-display mb-2 text-[1.75rem]">Payment successful</h1>
      <p className="type-body mb-8 max-w-sm">
        Welcome to the{" "}
        <span className="font-semibold uppercase text-amber-300">
          {planName}
        </span>{" "}
        tier. Your account features have been unlocked.
      </p>
      <Link
        href="/dashboard"
        className="type-cta w-full max-w-xs rounded-full bg-linear-to-r from-amber-400 to-orange-500 py-3 text-center text-black transition-opacity hover:opacity-95"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
