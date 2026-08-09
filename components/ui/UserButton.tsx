"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserImageContainer from "./UserImageContainer";
import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";

interface UserButtonProps {
  triggerClassName?: string;
  contentClassName?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  disableTriggerHoverScale?: boolean;
}

export default function UserButton({
  triggerClassName,
  contentClassName,
  align = "end",
  side = "bottom",
  sideOffset = 8,
  disableTriggerHoverScale = false,
}: UserButtonProps = {}) {
  const triggerBaseClassName = disableTriggerHoverScale
    ? "relative cursor-pointer"
    : "relative cursor-pointer hover:scale-105 transition-transform duration-200";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={`${triggerBaseClassName} ${triggerClassName ?? ""}`.trim()}
        >
          <UserImageContainer />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={`w-48 ${contentClassName ?? ""}`.trim()}
      >
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer outline:none">
          <Link href="/profile" prefetch>
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SignOutButton>
            <Button
              variant="ghost"
              className="flex items-center gap-2 outline:none"
            >
              <LogOut className="text-red-500" />
              Sign Out
            </Button>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
