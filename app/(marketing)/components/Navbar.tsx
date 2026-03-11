"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import UserButton from "@/components/ui/UserButton";
import { useEffect, useState } from "react";
import { useScrollToSection } from "@/hooks/useScrollToSection";

export default function Navbar() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("scenarios");
  const { isSignedIn } = useUser();
  const { scrollToSection } = useScrollToSection();
  const navLinks = [
    { name: "Scenarios", href: "/#scenarios", id: "scenarios" },
    { name: "Pricing", href: "/#pricing", id: "pricing" },
  ];

  const handleScrollToSection = (id: string) => {
    setActiveSection(id);
    scrollToSection(id);
  };

  useEffect(() => {
    const ids = navLinks.map((link) => link.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => b.intersectionRatio - a.intersectionRatio,
          )[0];

        if (visible?.target?.id) {
          setActiveSection(visible.target.id);
        }
      },
      { threshold: 0.4, rootMargin: "-20% 0px -35% 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 py-4">
      <div className="container mx-auto px-6 md:px-8">
        <div
          className="flex h-16 items-center justify-between 
                     backdrop-blur-xl bg-white/5 border border-white/10 
                     rounded-full px-6 md:px-8 shadow-2xl shadow-black/20"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center justify-center -ml-2 focus:outline-transparent focus:ring-transparent active:outline-transparent select-none"
          >
            <Image
              src="/logo/logo.svg"
              alt="Stanect"
              width={35}
              height={35}
              className="object-contain"
            />
            <span
              className=" text-xl font-display tracking-tighter 
                         bg-linear-to-r from-white to-white/80 bg-clip-text text-transparent"
            >
              stanect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => handleScrollToSection(link.id)}
                className={`font-medium transition-all duration-300 hover:scale-105 ${
                  activeSection === link.id
                    ? "text-amber-300"
                    : "text-white/80 hover:text-white"
                }`}
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
                disabled={isLoading}
                size="lg"
                className="hidden md:flex bg-linear-to-r from-amber-400 to-amber-500 
                         hover:from-amber-500 hover:to-amber-600 
                         text-black font-inter shadow-lg hover:shadow-amber-500/50 
                         transition-all duration-300 hover:scale-105"
              >
                <Link href={isSignedIn ? "/dashboard" : "/login"}>
                  {isLoading && <Loader2 className="animate-spin" />}
                  {isSignedIn ? "Dashboard" : "Start For Free"}
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
                <Link
                  href="/login"
                  className="text-sm text-white/80 hover:text-amber-300 transition-colors"
                >
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
