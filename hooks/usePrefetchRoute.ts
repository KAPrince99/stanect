"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";

/** Prefetch a route once per session mount (hover / focus / warm-up). */
export function usePrefetchRoute() {
  const router = useRouter();
  const prefetched = useRef(new Set<string>());

  return useCallback(
    (href: string) => {
      if (!href || prefetched.current.has(href)) return;
      prefetched.current.add(href);
      void router.prefetch(href);
    },
    [router],
  );
}

export const APP_NAV_ROUTES = [
  "/dashboard",
  "/new",
  "/pricing",
  "/profile",
] as const;
