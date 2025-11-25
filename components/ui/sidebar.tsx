"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import LordIcon from "./lordIcon";
import { Home, Sparkles, Plus } from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/pricing", icon: Sparkles, label: "Pricing" },
  { href: "/new", icon: Plus, label: "Create" },
];

export default function Sidebar() {
  return (
    <aside className="hidden sm:flex fixed left-0 top-0 h-screen w-24 z-50 pointer-events-none">
      <div className="flex flex-col items-center justify-center h-full pointer-events-auto">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <Link href="/" className="block p-4">
            <Image
              src="/logo/logo.svg"
              alt="Stanect"
              width={48}
              height={48}
              className="drop-shadow-2xl"
            />
          </Link>
        </motion.div>

        {/* Navigation Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="relative"
        >
          {/* Glow Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-orange-500/20 to-pink-500/20 blur-3xl rounded-full scale-150 animate-pulse" />

          {/* Main Orb */}
          <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full p-6 shadow-2xl">
            <div className="flex flex-col gap-10">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  whileHover={{ scale: 1.3, rotate: 15 }}
                  whileTap={{ scale: 1.1 }}
                  className="group relative"
                >
                  <Link
                    href={item.href}
                    className="block p-4 rounded-full bg-white/5 hover:bg-white/20 transition-all duration-300"
                  >
                    {item.href === "/new" ? (
                      <div className="relative">
                        <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity" />
                        <Plus className="w-8 h-8 text-white relative z-10 drop-shadow-lg" />
                      </div>
                    ) : item.href === "/pricing" ? (
                      <Sparkles className="w-8 h-8 text-amber-300 drop-shadow-lg" />
                    ) : (
                      <item.icon className="w-8 h-8 text-white drop-shadow-lg" />
                    )}
                  </Link>

                  {/* Tooltip */}
                  <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                    <div className="bg-black/80 backdrop-blur text-white text-sm px-4 py-2 rounded-full whitespace-nowrap shadow-2xl">
                      {item.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Floating Particles */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-10 pointer-events-none"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50" />
            <div className="absolute bottom-10 right-10 w-1.5 h-1.5 bg-pink-400 rounded-full shadow-lg shadow-pink-400/50" />
            <div className="absolute top-20 left-10 w-1 h-1 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" />
          </motion.div>
        </motion.div>

        {/* Bottom Accent */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 text-white/40 text-xs tracking-widest font-light"
        >
          STANECT
        </motion.div>
      </div>
    </aside>
  );
}
