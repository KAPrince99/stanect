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
import { redirect } from "next/navigation";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

export default function DeleteCompanionButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteCompanion(id);
      if (result.success) {
        toast.success(result.message);
        redirect("/dashboard");
      } else {
        toast.error("Failed to delete companion");
      }
    });
  }
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
            avatar and remove it&apos;s data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete(id)}
            className="cursor-pointer bg-destructive hover:bg-destructive/90 text-white"
            disabled={isPending}
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
