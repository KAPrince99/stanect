import { memo } from "react";

import ConfirmDialog from "@/components/ui/ConfirmDialog";

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
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Are you sure?"
      description="Downgrading to the Free plan will remove your Pro benefits immediately. You will lose access to unlimited companions and premium voices."
      cancelLabel="Wait, keep it"
      confirmLabel="Yes, Downgrade"
      onConfirm={onConfirm}
    />
  );
}
export default memo(PricingCancelDialog);
