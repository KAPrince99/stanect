// components/navbar/navbar.tsx
"use client";

import { motion } from "framer-motion";
import Pill from "./pill";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-[9999] flex justify-center items-center p-4 pointer-events-none "
    >
      <div className="pointer-events-auto w-full flex items-center justify-center">
        <Pill />
      </div>
    </motion.nav>
  );
}
