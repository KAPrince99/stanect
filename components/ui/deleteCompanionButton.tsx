"use client";

import { deleteCompanion } from "@/app/(app)/actions/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CompanionProps } from "@/types/types";
import React from "react";

import DeleteCompanionDialog from "./DeleteCompanionDialog";

export default function DeleteCompanionButton({ id }: { id: string }) {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (companionId: string) => deleteCompanion(companionId),
    onMutate: async (deletedId: string) => {
      await queryClient.cancelQueries({ queryKey: ["companions"] });

      const previousQueries = queryClient.getQueriesData({
        queryKey: ["companions"],
      });

      queryClient.setQueriesData({ queryKey: ["companions"] }, (old) => {
        if (Array.isArray(old)) {
          return old.filter(
            (companion: CompanionProps) => companion.id !== deletedId,
          );
        }

        if (
          old &&
          typeof old === "object" &&
          "id" in old &&
          (old as CompanionProps).id === deletedId
        ) {
          return null;
        }

        return old;
      });

      return { previousQueries };
    },
    onError: (err, _id, context) => {
      context?.previousQueries?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      toast.error(
        err instanceof Error ? err.message : "Failed to delete companion",
        {
          style: { background: "#ff4d4f" },
        },
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["companions"],
        type: "all",
      });
      await queryClient.invalidateQueries({
        queryKey: ["createCompanionGate"],
        type: "all",
      });
      toast.success("Companion deleted successfully", {
        description: "They've been removed from your world forever.",
        duration: 5000,
        style: {
          background: "linear-gradient(135deg, #0f1a36, #1a3a80)",
          border: "1px solid rgba(59, 130, 246, 0.5)",
          borderRadius: "1.5rem",
          color: "#fff",
          boxShadow: "0 20px 40px rgba(0, 198, 255, 0.25)",
        },
        icon: <Sparkles className="h-6 w-6 text-cyan-400" />,
        action: {
          label: "Undo",
          onClick: () => {
            toast("Undo not available yet", { duration: 2000 });
          },
        },
      });
      router.replace("/dashboard");
      setOpen(false);
    },
  });

  return (
    <DeleteCompanionDialog
      open={open}
      onOpenChange={setOpen}
      isPending={mutation.isPending}
      onConfirm={() => mutation.mutate(id)}
    />
  );
}
