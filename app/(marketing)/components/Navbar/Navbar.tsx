"use client";

import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";

import { useScrollToSection } from "@/hooks/useScrollToSection";

import NavbarActions from "./NavbarActions";
import { NavbarLogo } from "./NavbarLogo";
import { NAV_LINKS } from "./navLinks";
import DesktopNav from "./DesktopNav";

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
