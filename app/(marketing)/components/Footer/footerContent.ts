import type { LucideIcon } from "lucide-react";
import { Github, Twitter } from "lucide-react";

export type FooterLinkItem = {
  label: string;
  href: string;
};

export type FooterSocialItem = FooterLinkItem & {
  icon: LucideIcon;
  external?: boolean;
};

export const FOOTER_LINKS: FooterLinkItem[] = [
  { label: "Features", href: "/features" },
  { label: "Contact", href: "/contact" },
  { label: "About", href: "/company" },
];

export const FOOTER_SOCIALS: FooterSocialItem[] = [
  {
    label: "Twitter",
    href: "https://x.com/facultywave?s=21&t=EA7KVzb47NhFewv2bvQfpQ",
    icon: Twitter,
    external: true,
  },
  {
    label: "GitHub",
    href: "https://github.com/KAPrince99",
    icon: Github,
    external: true,
  },
];
