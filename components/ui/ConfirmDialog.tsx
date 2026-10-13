"use client";

import { Loader2 } from "lucide-react";
import { memo, type ReactNode } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  /** Controlled mode. Leave both out and pass `trigger` for uncontrolled use. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Element that opens the dialog (rendered with `asChild`). */
  trigger?: ReactNode;
  /** Optional icon shown in a round badge above the title. */
  icon?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  cancelLabel?: ReactNode;
  confirmLabel: ReactNode;
  confirmIcon?: ReactNode;
  /** Shown on the confirm button while `isPending` is true. */
  pendingLabel?: ReactNode;
  isPending?: boolean;
  /** `danger` for destructive actions, `primary` for everything else. */
  tone?: "danger" | "primary";
  onConfirm: () => void;
}

const BADGE_TONE = {
  danger: "border-red-500/30 bg-red-500/15 text-red-400",
  primary: "border-amber-500/30 bg-amber-500/15 text-amber-400",
} as const;

/**
 * The one confirm dialog: same corners, text, and button sizes everywhere.
 * Side-by-side buttons from `sm` up, stacked on phones with Confirm on top.
 * The dialog stays open after Confirm; the caller closes it when it is done.
 */
function ConfirmDialog({
  open,
  onOpenChange,
  trigger,
  icon,
  title,
  description,
  cancelLabel = "Cancel",
  confirmLabel,
  confirmIcon,
  pendingLabel,
  isPending = false,
  tone = "danger",
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger ? (
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      ) : null}

      <AlertDialogContent className="gap-0 rounded-3xl border border-white/10 bg-zinc-900 p-8 text-white shadow-2xl backdrop-blur-xl sm:max-w-md">
        <AlertDialogHeader className="items-center gap-0 space-y-3 text-center sm:text-center">
          {icon ? (
            <div
              className={`mb-1 flex size-16 items-center justify-center rounded-full border [&_svg]:size-9 ${BADGE_TONE[tone]}`}
            >
              {icon}
            </div>
          ) : null}
          <AlertDialogTitle className="type-title text-xl">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="type-body text-white/70">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-8 gap-3 sm:justify-stretch">
          <AlertDialogCancel
            variant="secondary"
            size="md"
            disabled={isPending}
            className="w-full sm:flex-1"
          >
            {cancelLabel}
          </AlertDialogCancel>

          <AlertDialogAction
            variant={tone === "danger" ? "danger" : "primary"}
            size="md"
            isPending={isPending}
            onClick={onConfirm}
            className="w-full sm:flex-1"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                {pendingLabel ?? confirmLabel}
              </>
            ) : (
              <>
                {confirmIcon}
                {confirmLabel}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default memo(ConfirmDialog);
