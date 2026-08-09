import { XCircleIcon } from "lucide-react";
import Link from "next/link";

interface ErrorViewProps {
  message?: string;
}

export default function ErrorView({ message }: ErrorViewProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-3xl border border-white/12 bg-white/[0.06] p-8 text-center backdrop-blur-xl">
      <div className="mb-6 rounded-full bg-red-500/20 p-4">
        <XCircleIcon className="h-14 w-14 text-red-400" />
      </div>
      <h1 className="type-display mb-2 text-[1.75rem]">Payment failed</h1>
      <p className="type-body mb-8 max-w-sm">
        {message ||
          "We couldn't process your transaction. Try again or use a different card."}
      </p>
      <div className="flex w-full max-w-xs flex-col gap-3 sm:flex-row">
        <Link
          href="/pricing"
          className="type-cta w-full rounded-full bg-linear-to-r from-amber-400 to-orange-500 py-3 text-center text-black transition-opacity hover:opacity-95"
        >
          Try Again
        </Link>
        <Link
          href="/dashboard"
          className="type-label w-full rounded-full border border-white/12 py-3 text-center text-white/80 transition-colors hover:bg-white/10"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
