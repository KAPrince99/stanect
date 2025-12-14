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

export default function UserButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Hidden on small screens */}
        <div className=" relative cursor-pointer hover:scale-105 transition-transform duration-200">
          <UserImageContainer />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 mt-5">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer outline:none">
          <Link href={"/profile"}>Profile</Link>
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
