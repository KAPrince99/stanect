"use client";

import { memo, useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import PricingCancelDialog from "@/components/ui/pricing/PricingCancelDialog";

interface ProfileBillingActionsProps {
  userId: string;
}

function ProfileBillingActions({ userId }: ProfileBillingActionsProps) {
  const queryClient = useQueryClient();
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [busy, setBusy] = useState<"portal" | "cancel" | null>(null);

  const openPortal = useCallback(async () => {
    try {
      setBusy("portal");
      const response = await fetch("/api/paystack/portal", { method: "POST" });
      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Could not open billing portal");
      }
      window.location.href = data.url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Billing portal failed");
      setBusy(null);
    }
  }, []);

  const confirmCancel = useCallback(async () => {
    try {
      setBusy("cancel");
      const response = await fetch("/api/paystack/cancel", { method: "POST" });
      if (!response.ok) {
        throw new Error("Could not process cancellation");
      }
      toast.success("Subscription cancelled", {
        description: "You are now on the Free plan.",
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["subscription", userId] }),
        queryClient.invalidateQueries({ queryKey: ["users", userId] }),
      ]);
    } catch {
      toast.error("Could not process cancellation.");
    } finally {
      setBusy(null);
      setIsCancelOpen(false);
    }
  }, [queryClient, userId]);

  return (
    <>
      <PricingCancelDialog
        open={isCancelOpen}
        onOpenChange={setIsCancelOpen}
        onConfirm={confirmCancel}
      />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          disabled={busy !== null}
          onClick={openPortal}
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
          onClick={() => setIsCancelOpen(true)}
          className="type-meta cursor-pointer text-red-300/80 transition hover:text-red-200 disabled:opacity-50"
        >
          {busy === "cancel" ? "Cancelling…" : "Cancel subscription"}
        </button>
      </div>
    </>
  );
}

export default memo(ProfileBillingActions);
