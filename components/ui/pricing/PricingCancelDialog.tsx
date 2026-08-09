import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { memo } from "react";

interface PricingCancelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

function PricingCancelDialog({
  open,
  onOpenChange,
  onConfirm,
}: PricingCancelDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-3xl border border-white/10 bg-zinc-900 backdrop-blur-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="type-title text-xl">
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="type-body">
            Downgrading to the Free plan will remove your Pro benefits
            immediately. You will lose access to unlimited companions and
            premium voices.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="type-label rounded-full border-none bg-white/5 text-white hover:bg-white/10">
            Wait, keep it
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="type-cta rounded-full border-none bg-red-500 text-white hover:bg-red-600"
          >
            Yes, Downgrade
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default memo(PricingCancelDialog);
