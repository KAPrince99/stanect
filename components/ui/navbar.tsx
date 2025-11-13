"use client";

import Pill from "./pill";
import { motion } from "motion/react";

export default function Navbar() {
  return (
    <motion.nav
      className="bg-stone-100 flex items-center justify-center p-2 fixed left-0 top-0 right-0 z-100 backdrop-blur-md "
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 15 }}
    >
      <Pill />
    </motion.nav>
  );
}
