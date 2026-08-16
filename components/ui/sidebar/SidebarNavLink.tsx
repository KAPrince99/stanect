"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { usePrefetchRoute } from "@/hooks/usePrefetchRoute";

import SidebarActivePill from "./SidebarActivePill";
import SidebarTooltip from "./SidebarTooltip";
import { sidebarTabClass } from "./sidebarShared";

interface SidebarNavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  children: ReactNode;
}

export default function SidebarNavLink({
  href,
  label,
  isActive,
  children,
}: SidebarNavLinkProps) {
  const prefetchRoute = usePrefetchRoute();

  return (
    <Link
      href={href}
      prefetch
      aria-current={isActive ? "page" : undefined}
      className={sidebarTabClass(isActive)}
      onMouseEnter={() => prefetchRoute(href)}
      onFocus={() => prefetchRoute(href)}
      onTouchStart={() => prefetchRoute(href)}
    >
      {isActive && <SidebarActivePill />}

      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>

      <SidebarTooltip label={label} />
    </Link>
  );
}
