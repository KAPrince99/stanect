export const sidebarNavItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    lordIcon: "https://cdn.lordicon.com/pgirtdfe.json",
    iconSize: 35,
  },
  {
    href: "/new",
    label: "Create",
    lordIcon: "https://cdn.lordicon.com/ueoydrft.json",
    iconSize: 40,
  },
  {
    href: "/pricing",
    label: "Pricing",
    lordIcon: "https://cdn.lordicon.com/opqmrqco.json",
    iconSize: 35,
  },
] as const;

export type SidebarNavItem = (typeof sidebarNavItems)[number];
