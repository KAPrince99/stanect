import { XCircleIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

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
        <Button asChild variant="primary" size="md" className="w-full sm:flex-1">
          <Link href="/pricing">Try Again</Link>
        </Button>
        <Button
          asChild
          variant="secondary"
          size="md"
          className="w-full sm:flex-1"
        >
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
