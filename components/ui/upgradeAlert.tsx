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
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="backdrop-blur-2xl bg-white/10 border border-white/20 p-10 rounded-3xl shadow-2xl max-w-md">
        <LordIcon
          src="https://cdn.lordicon.com/wdbwxkvh.json"
          trigger="loop"
          colors="primary:#e88c30,secondary:#ebe6ef,tertiary:#e88c30"
          height={75}
          width={75}
        />

        <h1 className="type-display mb-4 text-[1.75rem] md:text-[2rem]">
          Limit reached
        </h1>
        <p className="type-body mb-8">
          Your {plan.toUpperCase()} plan allows for {maxAllowed} companion.
          You&apos;ve already brought one to life!
        </p>
        <div className="flex flex-col gap-4">
          <Button
            asChild
            className="type-cta h-12 bg-linear-to-r from-amber-400 to-orange-500 text-black"
          >
            <Link href="/pricing">
              <span>Upgrade to Pro</span>{" "}
              <LordIcon
                src="https://cdn.lordicon.com/wmqqbxlm.json"
                trigger="loop"
                colors="primary:#ffffff,secondary:#e88c30,tertiary:#ebe6ef,quaternary:#e88c30,quinary:#ffffff"
                height={25}
                width={25}
              />
            </Link>
          </Button>
          <Button asChild variant="ghost" className="type-label text-white/50">
            <Link href="/dashboard">
              <ArrowLeft /> Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
