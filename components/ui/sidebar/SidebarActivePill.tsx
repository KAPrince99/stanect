"use client";

import { motion } from "framer-motion";

export default function SidebarActivePill() {
  return (
    <motion.span
      layoutId="sidebar-active-tab"
      className="absolute inset-0 rounded-full bg-[#e88c30]/40"
      transition={{
        type: "spring",
        stiffness: 380,
        damping: 32,
      }}
    />
  );
}
