"use client";

import { memo } from "react";
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
} from "../alert-dialog";

interface DeleteAccountDialogProps {
  deleting: boolean;
  onConfirm: () => void;
}

function DeleteAccountDialog({
  deleting,
  onConfirm,
}: DeleteAccountDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="type-meta cursor-pointer text-red-300/70 transition hover:text-red-200"
        >
          Delete account
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-3xl border border-white/10 bg-zinc-900 backdrop-blur-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="type-title text-xl">
            Delete your account?
          </AlertDialogTitle>
          <AlertDialogDescription className="type-body">
            This removes your Clerk login. Companions and billing may need
            separate cleanup. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="type-label rounded-full border-none bg-white/5 text-white hover:bg-white/10">
            Keep account
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={deleting}
            onClick={onConfirm}
            className="type-cta rounded-full border-none bg-red-500 text-white hover:bg-red-600"
          >
            {deleting ? "Deleting…" : "Yes, delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default memo(DeleteAccountDialog);
