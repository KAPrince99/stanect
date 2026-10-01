"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import Pill from "./pill";

export default function Navbar() {
  const pathname = usePathname();
  const alignToContentColumn =
    pathname === "/pricing" || pathname.startsWith("/dashboard");

  return (
    <nav
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50",
        alignToContentColumn
          ? "app-column-x pt-4"
          : "flex items-center justify-center p-4",
      )}
    >
      <div
        className={cn(
          "pointer-events-auto",
          alignToContentColumn
            ? "mx-auto w-full max-w-4xl"
            : "w-[min(100%,56rem)] px-4",
        )}
      >
        <Pill />
      </div>
    </nav>
  );
}
