import Link from "next/link";

import { FOOTER_LINKS } from "./footerContent";

export function FooterLinks() {
  return (
    <div className="flex gap-6 text-sm md:text-base">
      {FOOTER_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="transition-colors hover:text-amber-300"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
