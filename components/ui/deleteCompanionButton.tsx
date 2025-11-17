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
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CompanionProps } from "@/types/types";

export default function DeleteCompanionButton({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteCompanion(id),

    // 1️⃣ Optimistic update
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

    // 2️⃣ Rollback if error
    onError: (err, id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["companions"], context.previousData);
      }
      toast.error("Failed to delete companion");
    },

    // 3️⃣ On success
    onSuccess: async () => {
      toast.success("Companion deleted successfully 🎉");

      // Force fresh data from server
      await queryClient.invalidateQueries({
        queryKey: ["companions"],
        type: "all",
      });

      // Small delay to let toast appear
      setTimeout(() => {
        router.replace("/dashboard"); // redirect after fresh data
      }, 300);
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="cursor-pointer">
          Delete
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
          <AlertDialogAction
            onClick={() => mutation.mutate(id)}
            className="cursor-pointer bg-destructive hover:bg-destructive/90 text-white"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Continue"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
