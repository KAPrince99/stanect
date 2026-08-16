"use client";

import Link from "next/link";

import UserImageContainer from "@/components/ui/UserImageContainer";
import { usePrefetchRoute } from "@/hooks/usePrefetchRoute";

export default function PillProfileLink() {
  const prefetchRoute = usePrefetchRoute();

  return (
    <Link
      href="/profile"
      prefetch
      aria-label="Go to profile"
      className="relative transition-transform duration-200 hover:scale-105"
      onMouseEnter={() => prefetchRoute("/profile")}
      onFocus={() => prefetchRoute("/profile")}
    >
      <UserImageContainer />
      <span className="absolute -right-1 -bottom-1 h-3.5 w-3.5 rounded-full border-2 border-black bg-emerald-400 shadow-lg" />
    </Link>
  );
}
