"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 lg:hidden">
      <div className="relative">
        {/* Sleek blur background */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl rounded-full scale-105" />

        {/* Dock container */}
        <div className="relative bg-white/10 backdrop-blur-3xl border border-white/20 rounded-full px-4 py-3 flex gap-8 justify-center">
          {dockItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                {item.gradient ? (
                  <div className="relative">
                    <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-md opacity-70" />
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
    </div>
  );
}
