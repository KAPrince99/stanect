import { SignInButton } from "@clerk/nextjs";
import { LogIn } from "lucide-react";

export default function PillSignInButton() {
  return (
    <SignInButton mode="modal">
      <button
        type="button"
        className="type-cta flex cursor-pointer items-center gap-2 rounded-full bg-linear-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-black shadow-xl transition-transform hover:scale-105 hover:shadow-amber-500/50"
      >
        <LogIn className="h-5 w-5" />
        <span className="hidden sm:inline">Sign In</span>
      </button>
    </SignInButton>
  );
}
