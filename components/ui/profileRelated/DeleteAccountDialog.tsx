"use client";

import { memo } from "react";

import ConfirmDialog from "../ConfirmDialog";

interface DeleteAccountDialogProps {
  deleting: boolean;
  onConfirm: () => void;
}

function DeleteAccountDialog({
  deleting,
  onConfirm,
}: DeleteAccountDialogProps) {
  return (
    <ConfirmDialog
      trigger={
        // eslint-disable-next-line no-restricted-syntax -- text link trigger
        <button
          type="button"
          className="type-meta cursor-pointer text-red-300/70 transition hover:text-red-200"
        >
          Delete account
        </button>
      }
      title="Delete your account?"
      description="This removes your Clerk login. Companions and billing may need separate cleanup. This cannot be undone."
      cancelLabel="Keep account"
      confirmLabel="Yes, delete"
      pendingLabel="Deleting…"
      isPending={deleting}
      onConfirm={onConfirm}
    />
  );
}

export default memo(DeleteAccountDialog);
