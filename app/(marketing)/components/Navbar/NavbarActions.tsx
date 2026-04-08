import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

import { NavbarPrimaryAction } from "./NavbarPrimaryAction";
import { NavbarUserMenu } from "./NavbarUserMenu";
import { memo } from "react";

interface NavbarActionsProps {
  isLoading: boolean;
  isSignedIn?: boolean;
  onPrimaryAction: () => void;
}

function NavbarActions({
  isLoading,
  isSignedIn,
  onPrimaryAction,
}: NavbarActionsProps) {
  return (
    <div className="flex items-center gap-4">
      <NavbarPrimaryAction
        isLoading={isLoading}
        isSignedIn={isSignedIn}
        onClick={onPrimaryAction}
      />

      <SignedIn>
        <NavbarUserMenu />
      </SignedIn>

      <SignedOut>
        <Link
          href="/login"
          className="text-sm text-white/80 transition-colors hover:text-amber-300"
        >
          Log In
        </Link>
      </SignedOut>
    </div>
  );
}
export default memo(NavbarActions);
