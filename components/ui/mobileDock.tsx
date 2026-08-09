"use client";

import Link from "next/link";
import { useEffect } from "react";

import { APP_NAV_ROUTES, usePrefetchRoute } from "@/hooks/usePrefetchRoute";

import LordIcon from "./lordIcon";
import UserImageContainer from "./UserImageContainer";

const dockItems = [
  {
    href: "/dashboard",
    label: "Home",
    iconSrc: "https://cdn.lordicon.com/pgirtdfe.json",
    width: 30,
    height: 30,
  },
  {
    href: "/pricing",
    label: "Premium",
    iconSrc: "https://cdn.lordicon.com/opqmrqco.json",
    width: 30,
    height: 30,
  },
  {
    href: "/new",
    label: "Create",
    iconSrc: "https://cdn.lordicon.com/ueoydrft.json",
    width: 35,
    height: 35,
    gradient: true,
  },
  {
    href: "/profile",
    label: "Profile",
    iconSrc: "https://cdn.lordicon.com/hhljfoaj.json",
    width: 35,
    height: 35,
    profile: true,
  },
];

export default function MobileDock() {
  const prefetchRoute = usePrefetchRoute();

  useEffect(() => {
    for (const href of APP_NAV_ROUTES) {
      prefetchRoute(href);
    }
  }, [prefetchRoute]);

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 w-full border-t border-white/20 bg-linear-to-br from-[#0b1a36] via-[#1a3a80] to-[#1e4ea8] lg:hidden">
      <div className="mx-auto flex h-20 max-w-xl items-start justify-around px-4 pt-3">
        {dockItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            aria-label={item.label}
            className="relative transition-transform duration-150 active:scale-90"
            onMouseEnter={() => prefetchRoute(item.href)}
            onFocus={() => prefetchRoute(item.href)}
            onTouchStart={() => prefetchRoute(item.href)}
          >
            {item.gradient ? (
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-linear-to-r from-amber-400 to-orange-500 opacity-50 blur-md" />
                <LordIcon
                  src={item.iconSrc}
                  trigger="hover"
                  colors="primary:#e88c30,secondary:#ffffff,tertiary:#e88c30"
                  width={item.width}
                  height={item.height}
                />
              </div>
            ) : item.profile ? (
              <UserImageContainer />
            ) : (
              <LordIcon
                src={item.iconSrc}
                trigger="hover"
                colors="primary:#4bb3fd,secondary:#e88c30,tertiary:#1a3a80"
                width={item.width}
                height={item.height}
              />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
