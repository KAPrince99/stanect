import { ShieldAlert, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ConvoGuardProps {
  reason: "trial_expired" | "daily_limit_reached";
  plan: string;
}

export default function ConvoGuard({ reason, plan }: ConvoGuardProps) {
  const isTrial = reason === "trial_expired";

  return (
    <main className="flex items-center justify-center min-h-[70vh] p-4 md:-ml-30">
      <div className="backdrop-blur-2xl bg-white/10 border border-white/20 p-8 md:p-12 rounded-3xl shadow-2xl max-w-lg w-full text-center">
        <div className="bg-amber-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/50">
          {isTrial ? (
            <ShieldAlert className="w-10 h-10 text-amber-500" />
          ) : (
            <Clock className="w-10 h-10 text-amber-500" />
          )}
        </div>

        <h1 className="text-3xl font-display text-white mb-4 font-bold">
          {isTrial ? "Trial Period Ended" : "Daily Limit Reached"}
        </h1>

        <p className="text-white/70 mb-8 font-inter text-lg">
          {isTrial
            ? "Your 7-day exploration of Stanect AI has finished. Upgrade to Pro to keep your companions alive."
            : "You've used your 6 free minutes for today. Conversations reset every 24 hours at midnight."}
        </p>

        <div className="flex flex-col gap-4">
          <Button
            asChild
            className="bg-linear-to-r from-amber-400 to-orange-500 text-black font-bold h-12 text-md shadow-lg shadow-orange-500/20"
          >
            <Link
              href="/pricing"
              className="flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              Upgrade to Pro
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="text-white/50 hover:text-white hover:bg-white/5"
          >
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
