export type NavLinkItem = {
  name: string;
  href: string;
  id: string;
};

export const NAV_LINKS: NavLinkItem[] = [
  { name: "Scenarios", href: "/#scenarios", id: "scenarios" },
  { name: "Pricing", href: "/#pricing", id: "pricing" },
];
