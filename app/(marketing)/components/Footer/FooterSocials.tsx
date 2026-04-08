import Link from "next/link";

import { FOOTER_SOCIALS } from "./footerContent";

export function FooterSocials() {
  return (
    <div className="flex gap-4">
      {FOOTER_SOCIALS.map((social) => {
        const Icon = social.icon;

        return (
          <Link
            key={social.label}
            href={social.href}
            target={social.external ? "_blank" : undefined}
            rel={social.external ? "noopener noreferrer" : undefined}
            aria-label={social.label}
            className={`transition-colors ${
              social.label === "Twitter"
                ? "hover:text-amber-300"
                : "hover:text-white/80"
            }`}
          >
            <Icon className="h-5 w-5" />
          </Link>
        );
      })}
    </div>
  );
}
