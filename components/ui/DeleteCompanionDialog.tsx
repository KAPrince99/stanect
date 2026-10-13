"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import { memo, type ComponentProps } from "react";

import { Button } from "./button";
import ConfirmDialog from "./ConfirmDialog";
import LordIcon from "./lordIcon";
import { lordColors } from "@/lib/brand";

interface DeleteCompanionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
  variant?: "fab" | "ghost";
}

// Triggers must pass props through: Radix hands them the click handler.

/** Small "Delete" text button, used inside the call card. */
function GhostTrigger(props: ComponentProps<typeof Button>) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="type-meta gap-1.5 px-2.5 text-white/40 hover:bg-white/5 hover:text-red-300"
      {...props}
    >
      <Trash2 className="h-3.5 w-3.5" />
      Delete
    </Button>
  );
}

/** Round icon button, used on companion cards. */
function FabTrigger(props: ComponentProps<typeof Button>) {
  return (
    <Button
      size="icon"
      variant="outline"
      className="group size-16 rounded-full border-white/20 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-red-500/50 hover:bg-red-500/20"
      {...props}
    >
      <LordIcon
        src="https://cdn.lordicon.com/sxhqklqh.json"
        trigger="loop"
        colors={lordColors({ primary: "white", secondary: "danger", tertiary: "danger" })}
        height={25}
        width={25}
      />
    </Button>
  );
}

function DeleteCompanionDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
  variant = "fab",
}: DeleteCompanionDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      trigger={variant === "ghost" ? <GhostTrigger /> : <FabTrigger />}
      icon={<AlertTriangle />}
      title="Delete companion?"
      description={
        <>
          This action{" "}
          <span className="font-medium text-red-400">cannot be undone</span>.
          This companion and their call setup will be removed.
        </>
      }
      confirmIcon={<Trash2 />}
      confirmLabel="Yes, Delete Forever"
      pendingLabel="Deleting…"
      isPending={isPending}
      onConfirm={onConfirm}
    />
  );
}

export default memo(DeleteCompanionDialog);
