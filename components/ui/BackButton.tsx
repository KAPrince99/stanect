"use client";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

interface BackButtonProps {
  onClick: () => void;
  /** Accessible name. Defaults to the convo page's use. */
  label?: string;
}

/** Round glass icon button for stepping back. */
export default function BackButton({
  onClick,
  label = "Back to dashboard",
}: BackButtonProps) {
  return (
    <Button
      type="button"
      variant="glass"
      size="icon"
      className="size-11"
      onClick={onClick}
      aria-label={label}
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
}
