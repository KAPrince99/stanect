import { cn } from "@/lib/utils";

export function isSidebarRouteActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function sidebarTabClass(isActive: boolean) {
  return cn(
    "group relative block rounded-full p-4 transition-transform duration-200 hover:scale-105",
    isActive ? "" : "bg-white/5 hover:bg-white/20",
  );
}
