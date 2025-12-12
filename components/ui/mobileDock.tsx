"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import LordIcon from "./lordIcon";
import { profile } from "console";

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
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden w-full bg-gradient-to-br from-[#0b1a36] via-[#1a3a80] to-[#1e4ea8]  border-t border-white/20 ">
      <div className="flex justify-around items-start h-20 max-w-xl mx-auto px-4 pt-3">
        {dockItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <motion.div
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="relative"
            >
              {item.gradient ? (
                <div className="relative">
                  <div className="absolute -inset-1 bg-linear-to-r from-amber-400 to-orange-500 rounded-full blur-md opacity-50" />
                  <LordIcon
                    src={item.iconSrc}
                    trigger="loop"
                    colors="primary:#e88c30,secondary:#ffffff,tertiary:#e88c30"
                    width={item.width}
                    height={item.height}
                  />
                </div>
              ) : item.profile ? (
                <LordIcon
                  src={item.iconSrc}
                  trigger="loop"
                  colors="primary:#f5f3f1,secondary:#1a3a80,tertiary:#e88c30"
                  width={item.width}
                  height={item.height}
                />
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
