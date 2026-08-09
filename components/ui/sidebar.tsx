"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { APP_NAV_ROUTES, usePrefetchRoute } from "@/hooks/usePrefetchRoute";
import { cn } from "@/lib/utils";

import LordIcon from "./lordIcon";
import UserImageContainer from "./UserImageContainer";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    lordIcon: "https://cdn.lordicon.com/pgirtdfe.json",
  },
  {
    href: "/new",
    label: "Create",
    lordIcon: "https://cdn.lordicon.com/ueoydrft.json",
  },
  {
    href: "/pricing",
    label: "Pricing",
    lordIcon: "https://cdn.lordicon.com/opqmrqco.json",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const prefetchRoute = usePrefetchRoute();

  useEffect(() => {
    for (const href of APP_NAV_ROUTES) {
      prefetchRoute(href);
    }
  }, [prefetchRoute]);

  const isActiveRoute = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href || pathname.startsWith(`${href}/`);
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const getTabClasses = (isActive: boolean) =>
    cn(
      "group relative block rounded-full p-4 transition-transform duration-200 hover:scale-105",
      isActive
        ? "border border-white/70 shadow-md shadow-white/10"
        : "bg-white/5 hover:bg-white/20",
    );

  const intentHandlers = (href: string) => ({
    onMouseEnter: () => prefetchRoute(href),
    onFocus: () => prefetchRoute(href),
    onTouchStart: () => prefetchRoute(href),
  });

  return (
    <aside className="pointer-events-auto ml-6 flex h-full w-24 shrink-0 flex-col items-center py-10 lg:ml-8">
      <div className="flex h-full flex-col items-center justify-start py-40">
        <div className="relative">
          <div className="relative flex flex-col items-center gap-8 rounded-full border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
            {navItems.map((item) => {
              const isActive = isActiveRoute(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch
                  aria-current={isActive ? "page" : undefined}
                  className={getTabClasses(isActive)}
                  {...intentHandlers(item.href)}
                >
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active-tab"
                      className="absolute inset-0 rounded-full border border-white/70 bg-transparent"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}

                  <div className="relative z-10 flex items-center justify-center">
                    <LordIcon
                      src={item.lordIcon}
                      trigger="hover"
                      colors="primary:#e88c30,secondary:#ffffff,tertiary:#e88c30"
                      width={item.href === "/new" ? 40 : 35}
                      height={item.href === "/new" ? 40 : 35}
                    />
                  </div>

                  <div className="pointer-events-none absolute top-1/2 left-full -ml-2 -translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <div className="whitespace-nowrap rounded-full bg-white/10 px-2 py-1 text-[12px] text-white shadow-2xl backdrop-blur">
                      {item.label}
                    </div>
                  </div>
                </Link>
              );
            })}

            <Link
              href="/profile"
              prefetch
              aria-current={isActiveRoute("/profile") ? "page" : undefined}
              className={getTabClasses(isActiveRoute("/profile"))}
              {...intentHandlers("/profile")}
            >
              {isActiveRoute("/profile") && (
                <motion.span
                  layoutId="sidebar-active-tab"
                  className="absolute inset-0 rounded-full border border-white/70 bg-transparent"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}

              <div className="relative z-10 flex items-center justify-center">
                <UserImageContainer />
              </div>

              <div className="pointer-events-none absolute top-1/2 left-full -ml-2 -translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <div className="whitespace-nowrap rounded-full bg-white/10 px-2 py-1 text-[12px] text-white shadow-2xl backdrop-blur">
                  Profile
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-auto pt-16 text-xs font-light tracking-widest text-white/40">
          STANECT
        </div>
      </div>
    </aside>
  );
}
