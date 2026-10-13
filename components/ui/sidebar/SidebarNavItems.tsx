"use client";

import { usePathname } from "next/navigation";

import LordIcon from "@/components/ui/lordIcon";

import SidebarNavLink from "./SidebarNavLink";
import { sidebarNavItems } from "./sidebarNavConfig";
import { isSidebarRouteActive } from "./sidebarShared";
import { lordColors } from "@/lib/brand";

export default function SidebarNavItems() {
  const pathname = usePathname();

  return (
    <>
      {sidebarNavItems.map((item) => {
        const isActive = isSidebarRouteActive(pathname, item.href);

        return (
          <SidebarNavLink
            key={item.href}
            href={item.href}
            label={item.label}
            isActive={isActive}
          >
            <LordIcon
              src={item.lordIcon}
              trigger="hover"
              colors={lordColors({ primary: "accent", secondary: "white", tertiary: "accent" })}
              width={item.iconSize}
              height={item.iconSize}
            />
          </SidebarNavLink>
        );
      })}
    </>
  );
}
