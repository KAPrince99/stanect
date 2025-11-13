"use client";
import Pill from "./pill";
import { motion } from "motion/react";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 15 }}
      className="
        grid place-items-center
        sticky top-0 z-100
        bg-gray-100/0 backdrop-blur-md 
        
        
      "
    >
      <Pill />
    </motion.nav>
  );
}
