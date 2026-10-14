"use client";

import { useEffect } from "react";

import { APP_NAV_ROUTES, usePrefetchRoute } from "@/hooks/usePrefetchRoute";

import SidebarBackButton from "./SidebarBackButton";
import SidebarBrandMark from "./SidebarBrandMark";
import SidebarRail from "./SidebarRail";

export default function Sidebar() {
  const prefetchRoute = usePrefetchRoute();

  useEffect(() => {
    for (const href of APP_NAV_ROUTES) {
      prefetchRoute(href);
    }
  }, [prefetchRoute]);

  return (
    <aside className="pointer-events-auto relative ml-6 flex h-full w-24 shrink-0 flex-col items-center py-10 lg:ml-8">
      <SidebarBrandMark />
      <SidebarBackButton />
      <SidebarRail />
    </aside>
  );
}
