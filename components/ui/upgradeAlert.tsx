"use client";

import Link from "next/link";
import { Button } from "./button";
import LordIcon from "./lordIcon";
import { ArrowLeft } from "lucide-react";
import { lordColors } from "@/lib/brand";

export default function UpgradeAlert({
  plan,
  maxAllowed,
}: {
  plan: string;
  maxAllowed: number;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl sm:p-10">
        <LordIcon
          src="https://cdn.lordicon.com/wdbwxkvh.json"
          trigger="loop"
          colors={lordColors({ primary: "accent", secondary: "cream", tertiary: "accent" })}
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
          <Button asChild variant="primary" size="lg">
            <Link href="/pricing">
              <span>Upgrade to Pro</span>{" "}
              <LordIcon
                src="https://cdn.lordicon.com/wmqqbxlm.json"
                trigger="loop"
                colors={lordColors({ primary: "white", secondary: "accent", tertiary: "cream", quaternary: "accent", quinary: "white" })}
                height={25}
                width={25}
              />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="type-label text-white/50"
          >
            <Link href="/dashboard">
              <ArrowLeft /> Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
