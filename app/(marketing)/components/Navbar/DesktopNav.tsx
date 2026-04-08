import Link from "next/link";

import { NAV_LINKS } from "./navLinks";
import { memo } from "react";

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
            onClick={(event) => {
              onSelectSection(link.id);
              event.currentTarget.blur();
            }}
            className={`outline-none ring-0 font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${
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
export default memo(DesktopNav);
