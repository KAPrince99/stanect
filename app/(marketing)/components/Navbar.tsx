"use client";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import UserButton from "@/components/ui/UserButton";
import { Button } from "@/components/ui/button";
import { useScrollToSection } from "@/hooks/useScrollToSection";

type NavLinkItem = {
  name: string;
  href: string;
  id: string;
};

const NAV_LINKS: NavLinkItem[] = [
  { name: "Scenarios", href: "/#scenarios", id: "scenarios" },
  { name: "Pricing", href: "/#pricing", id: "pricing" },
];

function NavbarLogo() {
  return (
    <Link
      href="/"
      className="-ml-2 flex select-none items-center justify-center focus:outline-transparent focus:ring-transparent active:outline-transparent"
    >
      <Image
        src="/logo/logo.svg"
        alt="Stanect"
        width={35}
        height={35}
        className="object-contain"
      />
      <span className="bg-linear-to-r from-white to-white/80 bg-clip-text text-xl font-display tracking-tighter text-transparent">
        stanect
      </span>
    </Link>
  );
}

interface DesktopNavProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
}

function DesktopNav({ activeSection, onSelectSection }: DesktopNavProps) {
  return (
    <nav className="hidden items-center gap-10 md:flex">
      {NAV_LINKS.map((link) => {
        const isActive = activeSection === link.id;

        return (
          <Link
            key={link.id}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            onClick={() => onSelectSection(link.id)}
            className={`font-medium transition-all duration-300 hover:scale-105 ${
              isActive ? "text-amber-300" : "text-white/80 hover:text-white"
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}

interface NavbarPrimaryActionProps {
  isLoading: boolean;
  isSignedIn?: boolean;
  onClick: () => void;
}

function NavbarPrimaryAction({
  isLoading,
  isSignedIn,
  onClick,
}: NavbarPrimaryActionProps) {
  return (
    <Button
      asChild
      onClick={onClick}
      disabled={isLoading}
      size="lg"
      className="hidden md:flex bg-linear-to-r from-amber-400 to-amber-500 font-inter text-black shadow-lg transition-all duration-300 hover:scale-105 hover:from-amber-500 hover:to-amber-600 hover:shadow-amber-500/50"
    >
      <Link href={isSignedIn ? "/dashboard" : "/login"}>
        {isLoading ? <Loader2 className="animate-spin" /> : null}
        {isSignedIn ? "Dashboard" : "Start For Free"}
      </Link>
    </Button>
  );
}

function NavbarUserMenu() {
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

interface NavbarActionsProps {
  isLoading: boolean;
  isSignedIn?: boolean;
  onPrimaryAction: () => void;
}

function NavbarActions({
  isLoading,
  isSignedIn,
  onPrimaryAction,
}: NavbarActionsProps) {
  return (
    <div className="flex items-center gap-4">
      <NavbarPrimaryAction
        isLoading={isLoading}
        isSignedIn={isSignedIn}
        onClick={onPrimaryAction}
      />

      <SignedIn>
        <NavbarUserMenu />
      </SignedIn>

      <SignedOut>
        <Link
          href="/login"
          className="text-sm text-white/80 transition-colors hover:text-amber-300"
        >
          Log In
        </Link>
      </SignedOut>
    </div>
  );
}

export default function Navbar() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(NAV_LINKS[0].id);

  const { isSignedIn } = useUser();
  const { scrollToSection } = useScrollToSection();

  const handleScrollToSection = useCallback(
    (id: string) => {
      setActiveSection(id);
      scrollToSection(id);
    },
    [scrollToSection],
  );

  const handlePrimaryAction = useCallback(() => {
    setIsLoading(true);
  }, []);

  useEffect(() => {
    const elements = NAV_LINKS.map((link) =>
      document.getElementById(link.id),
    ).filter((element): element is HTMLElement => Boolean(element));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      { threshold: 0.4, rootMargin: "-20% 0px -35% 0px" },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 py-4">
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex h-16 items-center justify-between rounded-full border border-white/10 bg-white/5 px-6 shadow-2xl shadow-black/20 backdrop-blur-xl md:px-8">
          <NavbarLogo />
          <DesktopNav
            activeSection={activeSection}
            onSelectSection={handleScrollToSection}
          />
          <NavbarActions
            isLoading={isLoading}
            isSignedIn={isSignedIn}
            onPrimaryAction={handlePrimaryAction}
          />
        </div>
      </div>
    </header>
  );
}
