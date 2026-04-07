"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

  const isActiveRoute = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href || pathname.startsWith(`${href}/`);
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const getTabClasses = (isActive: boolean) =>
    cn(
      "group relative block rounded-full p-4 transition-all duration-300 transform hover:scale-110",
      isActive
        ? "scale-[1.035] border border-white/70 shadow-md shadow-white/10"
        : "bg-white/5 hover:bg-white/20",
    );

  return (
    <aside
      className="flex flex-col items-center w-24 h-full py-10 
                 pointer-events-auto ml-10"
    >
      <div className="flex flex-col items-center justify-start py-50 h-full">
        {/* Main Orb */}
        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-r from-amber-400/20 via-orange-500/20 to-pink-500/20 blur-xl rounded-full scale-125 animate-pulse" />
          <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-4 shadow-2xl flex flex-col gap-8 items-center">
            {navItems.map((item) => {
              const isActive = isActiveRoute(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={getTabClasses(isActive)}
                >
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active-tab"
                      className="absolute inset-0 rounded-full border border-white/70 bg-transparent"
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 28,
                      }}
                    />
                  )}

                  <div className="relative z-10 flex items-center justify-center">
                    {item.lordIcon && (
                      <LordIcon
                        src={item.lordIcon}
                        trigger="loop"
                        colors="primary:#e88c30,secondary:#ffffff,tertiary:#e88c30"
                        width={item.href === "/new" ? 40 : 35}
                        height={item.href === "/new" ? 40 : 35}
                      />
                    )}
                  </div>

                  {/* Tooltip */}
                  <div className="absolute left-full top-1/2 -ml-2 -translate-y-1/2 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100">
                    <div className="rounded-full bg-white/10 px-2 py-1 text-[12px] whitespace-nowrap text-white shadow-2xl backdrop-blur">
                      {item.label}
                    </div>
                  </div>
                </Link>
              );
            })}

            <Link
              href="/profile"
              aria-current={isActiveRoute("/profile") ? "page" : undefined}
              className={getTabClasses(isActiveRoute("/profile"))}
            >
              {isActiveRoute("/profile") && (
                <motion.span
                  layoutId="sidebar-active-tab"
                  className="absolute inset-0 rounded-full border border-white/70 bg-transparent"
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                />
              )}

              <div className="relative z-10 flex items-center justify-center">
                <UserImageContainer />
              </div>

              <div className="absolute left-full top-1/2 -ml-2 -translate-y-1/2 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100">
                <div className="rounded-full bg-white/10 px-2 py-1 text-[12px] whitespace-nowrap text-white shadow-2xl backdrop-blur">
                  Profile
                </div>
              </div>
            </Link>
          </div>

          {/* Floating Particles */}
          <div className="absolute -inset-8 pointer-events-none animate-spin-slow">
            <span className="absolute top-0 left-1/2 w-2 h-2 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50" />
            <span className="absolute bottom-10 right-10 w-1.5 h-1.5 bg-pink-400 rounded-full shadow-lg shadow-pink-400/50" />
            <span className="absolute top-20 left-10 w-1 h-1 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" />
          </div>
        </div>

        {/* Bottom Accent */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-auto pt-16 text-white/40 text-xs tracking-widest font-light"
        >
          STANECT
        </motion.div>
      </div>
    </aside>
  );
}
