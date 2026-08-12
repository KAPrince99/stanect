"use client";

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
import {
  AlertDialogOverlay,
  AlertDialogPortal,
} from "@radix-ui/react-alert-dialog";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { memo } from "react";

import { Button } from "./button";
import LordIcon from "./lordIcon";

interface DeleteCompanionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
  variant?: "fab" | "ghost";
}

function DeleteCompanionDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
  variant = "fab",
}: DeleteCompanionDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        {variant === "ghost" ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="type-meta h-9 gap-1.5 px-2.5 text-white/40 hover:bg-white/5 hover:text-red-300"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        ) : (
          <Button
            size="icon"
            variant="outline"
            className="group h-16 w-16 cursor-pointer rounded-full border-white/20 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-red-500/50 hover:bg-red-500/20"
          >
            <LordIcon
              src="https://cdn.lordicon.com/sxhqklqh.json"
              trigger="loop"
              colors="primary:#ffffff,secondary:#e83a30,tertiary:#e83a30"
              height={25}
              width={25}
            />
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogPortal>
        <AlertDialogOverlay className="fixed inset-0 animate-in bg-black/70 fade-in backdrop-blur-sm duration-300" />

        <AlertDialogContent className="max-w-md animate-in overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 p-0 text-white backdrop-blur-xl shadow-2xl zoom-in-95 duration-300">
          <div className="p-8">
            <AlertDialogHeader className="space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/15">
                <AlertTriangle className="h-9 w-9 text-red-400" />
              </div>

              <div className="space-y-3 text-center">
                <AlertDialogTitle className="type-title text-xl">
                  Delete companion?
                </AlertDialogTitle>
                <AlertDialogDescription className="type-body text-white/70">
                  This action{" "}
                  <span className="font-medium text-red-400">
                    cannot be undone
                  </span>
                  . This companion and their call setup will be removed.
                </AlertDialogDescription>
              </div>
            </AlertDialogHeader>

            <AlertDialogFooter className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-3">
              <AlertDialogCancel
                disabled={isPending}
                className="w-full cursor-pointer rounded-full border-none bg-white/5 px-8 py-6 text-lg font-medium text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/10 disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
              >
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction asChild>
                <Button
                  onClick={(event) => {
                    event.preventDefault();
                    if (isPending) return;
                    onConfirm();
                  }}
                  disabled={isPending}
                  className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border-none bg-red-500 px-10 py-6 text-lg font-medium text-white shadow-none transition-all duration-300 hover:bg-red-600 disabled:opacity-70 sm:w-auto"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Deleting…</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-5 w-5" />
                      <span>Yes, Delete Forever</span>
                    </>
                  )}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
}

export default memo(DeleteCompanionDialog);
