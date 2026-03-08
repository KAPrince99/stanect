"use client";

import Link from "next/link";
import { Button } from "./button";

export default function UpdatePlan() {
  return (
    <Link href="/pricing">
      <Button
        size="lg"
        className="w-full sm:w-auto px-8 h-12 text-base font-semibold bg-linear-to-r from-amber-500 to-orange-600 text-black"
      >
        Upgrade Plan
      </Button>
    </Link>
  );
}
