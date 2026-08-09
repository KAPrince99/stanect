"use client";

import Link from "next/link";
import { Button } from "../button";

export default function UpdatePlan({
  label = "Upgrade Plan",
}: {
  label?: string;
}) {
  return (
    <Link href="/pricing">
      <Button
        size="lg"
        className="type-cta h-11 w-full bg-linear-to-r from-amber-400 to-orange-500 px-8 text-black shadow-2xl shadow-amber-500/40 hover:from-amber-500 hover:to-orange-600 sm:w-auto"
      >
        {label}
      </Button>
    </Link>
  );
}
