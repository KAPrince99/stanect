"use client";

import { usePathname, useRouter } from "next/navigation";

import BackButton from "@/components/ui/BackButton";

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
      <BackButton onClick={() => router.push("/dashboard")} />
    </div>
  );
}
