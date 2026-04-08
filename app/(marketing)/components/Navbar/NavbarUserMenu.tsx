import { motion } from "framer-motion";

import UserButton from "@/components/ui/UserButton";

export function NavbarUserMenu() {
  return (
    <motion.div whileHover={{ scale: 1.1 }} className="relative flex">
      <UserButton />
      <motion.div
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-black bg-emerald-400 shadow-lg"
      />
    </motion.div>
  );
}
