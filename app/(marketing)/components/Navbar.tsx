"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  useUser,
} from "@clerk/nextjs";
import { motion } from "framer-motion";
import UserButton from "@/components/ui/UserButton";
import { useState } from "react";

export default function Navbar() {
  const [isLoading, setIsLoading] = useState(false);
  const { isSignedIn } = useUser();
  const navLinks = [
    { name: "Demo", href: "/#demo" },
    { name: "Scenarios", href: "/#scenarios" },
    { name: "Pricing", href: "/pricing" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 py-4">
      <div className="container mx-auto px-6 md:px-8">
        <div
          className="flex h-16 items-center justify-between 
                     backdrop-blur-xl bg-white/5 border border-white/10 
                     rounded-full px-6 md:px-8 shadow-2xl shadow-black/20"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center -ml-2 ">
            <Image
              src="/logo/logo.svg"
              alt="Stanect"
              width={35}
              height={35}
              className="object-contain"
            />
            <span
              className="md:hidden text-xl font-display tracking-tighter 
                         bg-linear-to-r from-white to-white/80 bg-clip-text text-transparent -ml-2"
            >
              tanect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-white/80 hover:text-white font-medium 
                           transition-all duration-300 hover:scale-105"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Desktop CTA */}
            <div className="flex items-center gap-4">
              <Button
                asChild
                onClick={() => {
                  setIsLoading(true);
                }}
                size="lg"
                className="hidden md:flex bg-linear-to-r from-amber-400 to-amber-500 
                         hover:from-amber-500 hover:to-amber-600 
                         text-black font-inter shadow-lg hover:shadow-amber-500/50 
                         transition-all duration-300 hover:scale-105"
              >
                <Link href={isSignedIn ? "/dashboard" : "/login"}>
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : isSignedIn ? (
                    "Dashboard"
                  ) : (
                    "Start For Free"
                  )}
                </Link>
              </Button>
              <SignedIn>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative flex"
                >
                  <UserButton />
                  {/* Online Indicator */}
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-black shadow-lg"
                  />
                </motion.div>
              </SignedIn>

              <SignedOut>
                <Link href="/login" className="text-sm">
                  Log In
                </Link>
              </SignedOut>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
