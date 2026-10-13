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
      variant="primary"
      size="md"
      className="hidden shadow-lg hover:scale-105 hover:shadow-amber-500/50 md:flex"
    >
      <Link href={isSignedIn ? "/dashboard" : "/login"}>
        {isLoading ? <Loader2 className="animate-spin" /> : null}
        {isSignedIn ? "Dashboard" : "Start For Free"}
      </Link>
    </Button>
  );
}
