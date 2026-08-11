"use client";

import { memo } from "react";

import PricingCancelDialog from "@/components/ui/pricing/PricingCancelDialog";

interface ProfileBillingActionRowProps {
  busy: "portal" | "cancel" | null;
  isCancelOpen: boolean;
  onOpenChangeCancel: (open: boolean) => void;
  onOpenPortal: () => void;
  onConfirmCancel: () => void;
  onRequestCancel: () => void;
}

function ProfileBillingActionRow({
  busy,
  isCancelOpen,
  onOpenChangeCancel,
  onOpenPortal,
  onConfirmCancel,
  onRequestCancel,
}: ProfileBillingActionRowProps) {
  return (
    <>
      <PricingCancelDialog
        open={isCancelOpen}
        onOpenChange={onOpenChangeCancel}
        onConfirm={onConfirmCancel}
      />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          disabled={busy !== null}
          onClick={onOpenPortal}
          className="type-meta cursor-pointer text-white/70 transition hover:text-white disabled:opacity-50"
        >
          {busy === "portal" ? "Opening…" : "Manage billing"}
        </button>
        <span className="text-white/20" aria-hidden>
          ·
        </span>
        <button
          type="button"
          disabled={busy !== null}
          onClick={onRequestCancel}
          className="type-meta cursor-pointer text-red-300/80 transition hover:text-red-200 disabled:opacity-50"
        >
          {busy === "cancel" ? "Cancelling…" : "Cancel subscription"}
        </button>
      </div>
    </>
  );
}

export default memo(ProfileBillingActionRow);
