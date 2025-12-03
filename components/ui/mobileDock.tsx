"use client";

import Link from "next/link";
import { motion } from "framer-motion";
// Assuming LordIcon is correctly defined or mocked in your project setup
import LordIcon from "./lordIcon";

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
];

export default function MobileDock() {
  return (
    // UPDATED: Fixed to bottom edge, full width (left-0 right-0 bottom-0)
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden w-full bg-gradient-to-br from-[#0b1a36] via-[#1a3a80] to-[#1e4ea8]  border-t border-white/20 ">
      {/* Dock container: Use justify-around to evenly space items across the bar. */}
      <div className="flex justify-around items-center h-16 max-w-xl mx-auto px-4">
        {dockItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <motion.div
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="relative"
            >
              {item.gradient ? (
                <div className="relative">
                  {/* Reduced glow effect to fit bar better */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-md opacity-50" />
                  <LordIcon
                    src={item.iconSrc}
                    trigger="loop"
                    colors="primary:#e88c30,secondary:#ffffff,tertiary:#e88c30"
                    width={item.width}
                    height={item.height}
                  />
                </div>
              ) : (
                <LordIcon
                  src={item.iconSrc}
                  trigger="loop"
                  colors="primary:#4bb3fd,secondary:#e88c30,tertiary:#1a3a80"
                  width={item.width}
                  height={item.height}
                />
              )}
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
