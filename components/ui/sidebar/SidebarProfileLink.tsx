"use client";

import { usePathname } from "next/navigation";

import UserImageContainer from "@/components/ui/UserImageContainer";

import SidebarNavLink from "./SidebarNavLink";
import { isSidebarRouteActive } from "./sidebarShared";

export default function SidebarProfileLink() {
  const pathname = usePathname();
  const isActive = isSidebarRouteActive(pathname, "/profile");

  return (
    <SidebarNavLink href="/profile" label="Profile" isActive={isActive}>
      <UserImageContainer />
    </SidebarNavLink>
  );
}
