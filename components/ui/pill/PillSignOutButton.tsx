import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export default function PillSignOutButton() {
  return (
    <SignOutButton>
      <button
        type="button"
        aria-label="Sign out"
        className="flex cursor-pointer items-center gap-1 rounded-full border border-white/10 bg-black px-2.5 py-1 text-xs font-medium text-white/85 transition-colors hover:bg-black/80 hover:text-white"
      >
        <LogOut className="h-3.5 w-3.5 text-red-400" />
        <span className="hidden xl:inline">Sign Out</span>
      </button>
    </SignOutButton>
  );
}
