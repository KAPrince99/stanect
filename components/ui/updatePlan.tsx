"use client";

import { Button } from "./button";
import LordIcon from "./lordIcon";

export default function UpdatePlan() {
  return (
    <Button
      size="lg"
      className="w-full sm:w-auto px-8 h-12 text-base font-semibold bg-linear-to-r from-amber-500 to-orange-600 text-black"
    >
      <LordIcon
        src="https://cdn.lordicon.com/wmqqbxlm.json"
        trigger="loop"
        colors="primary:#ffffff,secondary:#e88c30,tertiary:#ebe6ef,quaternary:#e88c30,quinary:#ffffff"
        height={20}
        width={20}
      />
      Upgrade Plan
    </Button>
  );
}
