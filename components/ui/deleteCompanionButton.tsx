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
import { AlertTriangle, Loader2, Sparkles, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CompanionProps } from "@/types/types";
import React from "react";
import {
  AlertDialogOverlay,
  AlertDialogPortal,
} from "@radix-ui/react-alert-dialog";

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
      toast.success("Companion deleted successfully", {
        description: "They’ve been removed from your world forever.",
        duration: 5000,
        style: {
          background: "linear-gradient(135deg, #0f1a36, #1a3a80)",
          border: "1px solid rgba(59, 130, 246, 0.5)",
          borderRadius: "1.5rem",
          color: "#fff",
          boxShadow: "0 20px 40px rgba(0, 198, 255, 0.25)",
        },
        icon: <Sparkles className="w-6 h-6 text-cyan-400" />,
        action: {
          label: "Undo",
          onClick: () => {
            // Optional: implement undo logic later
            toast("Undo not available yet", { duration: 2000 });
          },
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
          className="w-16 h-16 rounded-full border-white/20 bg-white/5 backdrop-blur-xl hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300 group cursor-pointer"
        >
          <Trash2 className="w-7 h-7 text-red-400 group-hover:text-red-300 transition-colors" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogPortal>
        <AlertDialogOverlay className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300" />

        <AlertDialogContent
          className="
      max-w-md 
      bg-gradient-to-br from-[#0f1a36] via-[#1a2a5c] to-[#0f1a36]
      border border-white/10 
      rounded-3xl 
      shadow-2xl 
      overflow-hidden
      text-white
      p-0
      animate-in zoom-in-95 duration-300
    "
        >
          {/* Glowing top border accent */}
          <div className="h-1 bg-gradient-to-r from-red-500 via-red-600 to-pink-600" />

          <div className="p-8">
            <AlertDialogHeader className="space-y-4">
              {/* Warning Icon */}
              <div className="mx-auto w-16 h-16 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center">
                <AlertTriangle className="w-9 h-9 text-red-400" />
              </div>

              <div className="text-center space-y-3">
                <AlertDialogTitle className="text-2xl font-bold tracking-tight">
                  Permanently Delete Avatar?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-white/70 text-base leading-relaxed">
                  This action{" "}
                  <span className="text-red-400 font-medium">
                    cannot be undone
                  </span>
                  . Your avatar and all associated data will be permanently
                  removed from our servers.
                </AlertDialogDescription>
              </div>
            </AlertDialogHeader>

            <AlertDialogFooter className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-3">
              <AlertDialogCancel
                className="
            w-full sm:w-auto 
            px-8 py-6 
            rounded-2xl 
            bg-white/10 
            border border-white/20 
            backdrop-blur-xl 
            text-white 
            hover:bg-white/20 
            hover:border-white/40 
            transition-all duration-300 
            font-medium text-lg cursor-pointer
          "
              >
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction asChild>
                <Button
                  onClick={handleDelete}
                  disabled={mutation.isPending}
                  className="
                w-full sm:w-auto 
                px-10 py-6 
                rounded-2xl 
                bg-gradient-to-r from-red-600 to-pink-600 
                hover:from-red-500 hover:to-pink-500 
                text-white font-medium text-lg
                shadow-lg shadow-red-600/50
                transition-all duration-300
                flex items-center justify-center gap-3
                disabled:opacity-70 cursor-pointer
              "
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      <span>Yes, Delete Forever</span>
                    </>
                  )}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
}
