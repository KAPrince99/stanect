"use client";

import { deleteCompanion } from "@/app/(app)/actions/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CompanionProps } from "@/types/types";
import React, { useCallback } from "react";

import DeleteCompanionDialog from "./DeleteCompanionDialog";

export default function DeleteCompanionButton({
  id,
  variant = "fab",
}: {
  id: string;
  variant?: "fab" | "ghost";
}) {
  const [open, setOpen] = React.useState(false);
  const [isLeaving, setIsLeaving] = React.useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (companionId: string) => deleteCompanion(companionId),
    onMutate: async (deletedId: string) => {
      await queryClient.cancelQueries({ queryKey: ["companions"] });

      const previousQueries = queryClient.getQueriesData({
        queryKey: ["companions"],
      });

      // Only patch list caches. Leave ["companions", id] alone so the
      // current detail page stays mounted while the request is in flight.
      queryClient.setQueriesData({ queryKey: ["companions"] }, (old) => {
        if (!Array.isArray(old)) return old;
        return old.filter(
          (companion: CompanionProps) => companion.id !== deletedId,
        );
      });

      return { previousQueries };
    },
    onError: (err, _id, context) => {
      setIsLeaving(false);
      context?.previousQueries?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      toast.error(
        err instanceof Error ? err.message : "Failed to delete companion",
      );
    },
    onSuccess: async (_result, deletedId) => {
      setIsLeaving(true);
      // Refresh lists and the create gate, but do not refetch this companion
      // while the convo page is still mounted — that paints a blank screen.
      await queryClient.invalidateQueries({
        queryKey: ["companions"],
        predicate: (query) => query.queryKey[1] !== deletedId,
      });
      await queryClient.invalidateQueries({
        queryKey: ["createCompanionGate"],
        type: "all",
      });
      toast.success("Companion deleted");
      router.replace("/dashboard");
    },
  });

  const isBusy = mutation.isPending || isLeaving;

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (isBusy && !nextOpen) return;
      setOpen(nextOpen);
    },
    [isBusy],
  );

  return (
    <DeleteCompanionDialog
      open={open}
      onOpenChange={handleOpenChange}
      isPending={isBusy}
      onConfirm={() => mutation.mutate(id)}
      variant={variant}
    />
  );
}
