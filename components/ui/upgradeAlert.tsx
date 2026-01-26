"use client";

import Link from "next/link";
import { Button } from "./button";
import LordIcon from "./lordIcon";
import { ArrowLeft } from "lucide-react";

export default function UpgradeAlert({
  plan,
  maxAllowed,
}: {
  plan: string;
  maxAllowed: number;
}) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center lg:-ml-30">
      <div className="backdrop-blur-2xl bg-white/10 border border-white/20 p-10 rounded-3xl shadow-2xl max-w-md">
        <LordIcon
          src="https://cdn.lordicon.com/wdbwxkvh.json"
          trigger="loop"
          colors="primary:#e88c30,secondary:#ebe6ef,tertiary:#e88c30"
          height={75}
          width={75}
        />

        <h1 className="text-3xl md:text-4xl font-display text-white mb-4 font-bold">
          Limit Reached
        </h1>
        <p className="text-white/70 mb-8 font-inter">
          Your {plan.toUpperCase()} plan allows for {maxAllowed} companion.
          You&apos;ve already brought one to life!
        </p>
        <div className="flex flex-col gap-4">
          <Button
            asChild
            className="bg-linear-to-r from-amber-400 to-orange-500 text-black font-bold h-12"
          >
            <Link href="/pricing">
              <span className="text-md md:text-lg">Upgrade to Pro</span>{" "}
              <LordIcon
                src="https://cdn.lordicon.com/wmqqbxlm.json"
                trigger="loop"
                colors="primary:#ffffff,secondary:#e88c30,tertiary:#ebe6ef,quaternary:#e88c30,quinary:#ffffff"
                height={25}
                width={25}
              />
            </Link>
          </Button>
          <Button asChild variant="ghost" className="text-white/50 ">
            <Link href="/dashboard">
              <ArrowLeft /> Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
