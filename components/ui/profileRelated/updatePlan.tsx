"use client";

import Link from "next/link";
import { Button } from "../button";

export default function UpdatePlan() {
  return (
    <Link href="/pricing">
      <Button
        size="lg"
        className="type-cta h-11 w-full bg-linear-to-r from-amber-500 to-orange-600 px-8 text-black sm:w-auto"
      >
        Upgrade Plan
      </Button>
    </Link>
  );
}
