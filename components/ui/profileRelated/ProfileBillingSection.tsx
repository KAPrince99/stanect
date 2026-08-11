"use client";

import { memo, useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import ProfileBillingActionRow from "./ProfileBillingActionRow";

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
    <ProfileBillingActionRow
      busy={busy}
      isCancelOpen={isCancelOpen}
      onOpenChangeCancel={setIsCancelOpen}
      onOpenPortal={openPortal}
      onConfirmCancel={confirmCancel}
      onRequestCancel={() => setIsCancelOpen(true)}
    />
  );
}

export default memo(ProfileBillingActions);
