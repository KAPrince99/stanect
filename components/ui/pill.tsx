// components/navbar/pill.tsx
"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import UploadButton from "./uploadButton";
import { Sparkles, LogIn } from "lucide-react";

export default function Pill() {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
      whileHover={{ scale: 1.03 }}
      className="
        relative
        h-14 sm:h-16
        w-full max-w-xl
        bg-white/10 backdrop-blur-2xl
        border border-white/20
        rounded-full
        shadow-2xl shadow-black/40
        flex items-center justify-between
        px-6 sm:px-8
        overflow-hidden
        group
      "
    >
      {/* Floating Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-orange-500/10 to-pink-500/10 blur-3xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Left: Logo + Brand */}
      <Link href="/" className="flex items-center  z-10">
        <div className="relative">
          <Image
            src="/logo/logo.svg"
            alt="Stanect"
            width={42}
            height={42}
            className="drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 bg-gradient-to-r from-amber-400/20 to-pink-500/20 rounded-full blur-xl"
          />
        </div>

        <span className="hidden sm:block text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent -ml-1">
          tanect
        </span>
      </Link>

      {/* Center: Upload (only on large screens) */}
      <div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
        <UploadButton />
      </div>

      {/* Right: Auth */}
      <div className="flex items-center gap-4 z-10">
        <SignedOut>
          <SignInButton mode="modal">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold rounded-full shadow-xl hover:shadow-amber-500/50 transition-all"
            >
              <LogIn className="w-5 h-5" />
              <span className="hidden sm:inline">Sign In</span>
            </motion.button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <motion.div whileHover={{ scale: 1.1 }} className="relative">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-12 h-12 ring-4 ring-white/30 shadow-2xl",
                },
              }}
            />
            {/* Online Indicator */}
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-black shadow-lg"
            />
          </motion.div>
        </SignedIn>
      </div>

      {/* Floating Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [-100, 800],
            y: [0, -50, 20],
          }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          className="absolute top-4 left-0"
        >
          <Sparkles className="w-5 h-5 text-amber-300 opacity-60" />
        </motion.div>
        <motion.div
          animate={{
            x: [800, -100],
            y: [20, -30, 0],
          }}
          transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
          className="absolute bottom-4 right-0"
        >
          <Sparkles className="w-4 h-4 text-pink-300 opacity-50" />
        </motion.div>
      </div>
    </motion.div>
  );
}
