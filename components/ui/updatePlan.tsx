"use client";

import { Button } from "./button";
import { Crown } from "lucide-react";

export default function UpdatePlan() {
  return (
    <Button
      size="lg"
      className="w-full sm:w-auto px-8 h-12 text-base font-semibold bg-linear-to-r from-amber-500 to-orange-600 text-black"
    >
      <Crown className="w-5 h-5 mr-2" /> Upgrade Plan
    </Button>
  );
}
