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

interface PricingCurrencyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  planName: string;
  usdPrice: number;
  intervalLabel: string;
}

function PricingCurrencyDialog({
  open,
  onOpenChange,
  onConfirm,
  planName,
  usdPrice,
  intervalLabel,
}: PricingCurrencyDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-3xl border border-white/10 bg-zinc-900 text-white backdrop-blur-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="type-title text-xl">
            Currency conversion notice
          </AlertDialogTitle>
          <AlertDialogDescription className="type-body space-y-3 text-white/70">
            <span className="block">
              You're starting the{" "}
              <span className="text-white">{planName}</span> plan at{" "}
              <span className="text-white">
                ${usdPrice}
                {intervalLabel}
              </span>
              .
            </span>
            <span className="block">
              Payments are processed in{" "}
              <span className="text-amber-300">Ghana Cedis (GHS)</span> via
              Paystack. Your card or mobile money charge will be the GHS
              equivalent of this USD amount at the current conversion rate.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="type-label rounded-full border-none bg-white/5 text-white hover:bg-white/10 hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="type-cta rounded-full border-none bg-linear-to-r from-amber-400 to-orange-500 text-black hover:from-amber-500 hover:to-orange-600"
          >
            Continue to payment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default memo(PricingCurrencyDialog);
