import { memo } from "react";

import ConfirmDialog from "@/components/ui/ConfirmDialog";

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
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      tone="primary"
      title="Currency conversion notice"
      description={
        <>
          <span className="block">
            You're starting the{" "}
            <span className="text-white">{planName}</span> plan at{" "}
            <span className="text-white">
              ${usdPrice}
              {intervalLabel}
            </span>
            .
          </span>
          <span className="mt-3 block">
            Payments are processed in{" "}
            <span className="text-amber-300">Ghana Cedis (GHS)</span> via
            Paystack. Your card or mobile money charge will be the GHS
            equivalent of this USD amount at the current conversion rate.
          </span>
        </>
      }
      confirmLabel="Continue to payment"
      onConfirm={onConfirm}
    />
  );
}

export default memo(PricingCurrencyDialog);
