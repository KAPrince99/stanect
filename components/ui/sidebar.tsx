"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import LordIcon from "./lordIcon";
import { Home, Sparkles, Plus } from "lucide-react";

const navItems = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Dashboard",
    lordIcon: "https://cdn.lordicon.com/pgirtdfe.json",
  },
  {
    href: "/new",
    icon: Plus,
    label: "Create",
    lordIcon: "https://cdn.lordicon.com/ueoydrft.json",
  },
  {
    href: "/pricing",
    icon: Sparkles,
    label: "Pricing",
    lordIcon: "https://cdn.lordicon.com/opqmrqco.json",
  },
];

export default function Sidebar() {
  return (
    <aside
      className="flex flex-col items-center w-24 h-full py-10 
                 pointer-events-auto ml-7"
    >
      <div className="flex flex-col items-center justify-start py-50 h-full">
        {/* Main Orb */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-orange-500/20 to-pink-500/20 blur-xl rounded-full scale-125 animate-pulse" />
          <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-4 shadow-2xl flex flex-col gap-8">
            {navItems.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative block p-4 rounded-full bg-white/5 hover:bg-white/20 transition-transform duration-300 transform hover:scale-110"
              >
                <div className="relative flex justify-center items-center">
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
                <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                  <div className="bg-black/80 backdrop-blur text-white text-sm px-4 py-2 rounded-full whitespace-nowrap shadow-2xl">
                    {item.label}
                  </div>
                </div>
              </Link>
            ))}
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
