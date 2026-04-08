import { Loader2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface NavbarPrimaryActionProps {
  isLoading: boolean;
  isSignedIn?: boolean;
  onClick: () => void;
}

export function NavbarPrimaryAction({
  isLoading,
  isSignedIn,
  onClick,
}: NavbarPrimaryActionProps) {
  return (
    <Button
      asChild
      onClick={onClick}
      disabled={isLoading}
      size="lg"
      className="hidden md:flex bg-linear-to-r from-amber-400 to-amber-500 font-inter text-black shadow-lg transition-all duration-300 hover:scale-105 hover:from-amber-500 hover:to-amber-600 hover:shadow-amber-500/50"
    >
      <Link href={isSignedIn ? "/dashboard" : "/login"}>
        {isLoading ? <Loader2 className="animate-spin" /> : null}
        {isSignedIn ? "Dashboard" : "Start For Free"}
      </Link>
    </Button>
  );
}
