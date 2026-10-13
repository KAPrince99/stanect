import { SignInButton } from "@clerk/nextjs";
import { LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function PillSignInButton() {
  return (
    <SignInButton mode="modal">
      <Button
        type="button"
        variant="primary"
        size="md"
        className="px-5 shadow-xl hover:scale-105 hover:shadow-amber-500/50"
      >
        <LogIn className="h-5 w-5" />
        <span className="hidden sm:inline">Sign In</span>
      </Button>
    </SignInButton>
  );
}
