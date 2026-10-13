"use client";

import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

function isCompanionCall(pathname: string) {
  return /^\/dashboard\/[^/]+$/.test(pathname);
}

/**
 * Sits in the sidebar column, outside the pill, on the same top line as the
 * Delete button inside the call card:
 * page pt-24 (6rem) + card border (1px) + Delete's top-4 (1rem).
 */
export default function SidebarBackButton() {
  const pathname = usePathname();
  const router = useRouter();

  if (!isCompanionCall(pathname)) return null;

  return (
    <div className="absolute inset-x-0 top-[calc(6rem+1px+1rem)] flex justify-center">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-11 rounded-full border border-white/10 bg-white/8 text-white backdrop-blur-md hover:bg-white/10"
        onClick={() => router.push("/dashboard")}
        aria-label="Back to dashboard"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
    </div>
  );
}
