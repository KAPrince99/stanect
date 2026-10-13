"use client";

import Link from "next/link";
import { Button } from "../button";

export default function UpdatePlan({
  label = "Upgrade Plan",
}: {
  label?: string;
}) {
  return (
    <Button
      asChild
      variant="primary"
      size="md"
      className="w-full shadow-2xl shadow-amber-500/40 sm:w-auto"
    >
      <Link href="/pricing">{label}</Link>
    </Button>
  );
}
