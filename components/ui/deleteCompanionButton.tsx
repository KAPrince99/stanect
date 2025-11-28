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
import { Button } from "./button";
import { deleteCompanion } from "@/app/(app)/actions/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CompanionProps } from "@/types/types";
import React from "react";

export default function DeleteCompanionButton({ id }: { id: string }) {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteCompanion(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["companions"] });
      const previousData = queryClient.getQueryData<CompanionProps[]>([
        "companions",
      ]);
      queryClient.setQueryData(["companions"], (old?: CompanionProps[]) =>
        old?.filter((c) => c.id !== id)
      );
      return { previousData };
    },
    onError: (err, id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["companions"], context.previousData);
      }
      toast.error("Failed to delete companion", {
        style: { background: "#ff4d4f" },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["companions"],
        type: "all",
      });
      toast.success("Companion deleted successfully 🎉", {
        style: {
          background: "linear-gradient(135deg,#0072c3,#00c6ff])",
        },
      });
      router.replace("/dashboard");
      setOpen(false);
    },
  });

  const handleDelete = () => {
    mutation.mutate(id);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="w-16 h-16 rounded-full border-white/30 bg-white/10 backdrop-blur hover:bg-white/20 cursor-pointer"
        >
          <Trash2 className="w-7 h-7 text-red-500" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-stone-100">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            avatar and remove its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>

          <Button
            onClick={handleDelete}
            disabled={mutation.isPending}
            className="bg-destructive hover:bg-destructive/90 text-white cursor-pointer"
          >
            {mutation.isPending ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              "Continue"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
