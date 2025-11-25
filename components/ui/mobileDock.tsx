// components/ui/mobile-dock.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Sparkles, Plus } from "lucide-react";

const dockItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/pricing", icon: Sparkles, label: "Premium" },
  { href: "/new", icon: Plus, label: "Create" },
];

export default function MobileDock() {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 lg:hidden"
    >
      <div className="relative">
        {/* Blur Background */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl rounded-full scale-110" />

        {/* Dock */}
        <div className="relative bg-white/10 backdrop-blur-3xl border border-white/20 rounded-full px-8 py-5 shadow-2xl flex gap-12">
          {dockItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.3, y: -10 }}
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                {item.href === "/new" ? (
                  <div className="relative">
                    <div className="absolute -inset-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-xl opacity-70" />
                    <Plus className="w-8 h-8 text-white relative z-10" />
                  </div>
                ) : (
                  <item.icon className="w-8 h-8 text-white/80 hover:text-white transition-colors" />
                )}
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
