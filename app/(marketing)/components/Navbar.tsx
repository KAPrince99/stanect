"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function Navbar() {
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
              className="md:hidden text-2xl font-display tracking-tighter 
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
                size="lg"
                className="hidden md:flex bg-linear-to-r from-amber-400 to-amber-500 
                         hover:from-amber-500 hover:to-amber-600 
                         text-black font-inter shadow-lg hover:shadow-amber-500/50 
                         transition-all duration-300 hover:scale-105"
              >
                <Link href={isSignedIn ? "/dashboard" : "/login"}>
                  {isSignedIn ? "Dashboard" : "Start For Free"}
                </Link>
              </Button>
              <SignedIn>
                <motion.div whileHover={{ scale: 1.1 }} className="relative">
                  <UserButton
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

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-white hover:bg-white/10"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="bg-linear-to-b from-[#0b1a36] to-[#1e4ea8] border-white/10 p-6"
              >
                <motion.div
                  initial={{ x: 200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 200, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="flex flex-col gap-8 mt-10"
                >
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-2xl font-display text-white/90 hover:text-white transition"
                    >
                      {link.name}
                    </Link>
                  ))}

                  <Button
                    asChild
                    size="lg"
                    className="mt-6 bg-linear-to-r from-amber-400 to-amber-500 
                               hover:from-amber-500 hover:to-amber-600 
                               text-black font-display"
                  >
                    <Link href={isSignedIn ? "/dashboard" : "/login"}>
                      {isSignedIn ? "Dashboard" : "Log in"}
                    </Link>
                  </Button>
                </motion.div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
