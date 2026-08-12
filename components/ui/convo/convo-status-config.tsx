import { Radio, X, Zap } from "lucide-react";
import { type ReactNode } from "react";

import { CallStatus } from "@/store/use-convo-store";

import LordIcon from "../lordIcon";

export interface ConvoStatusView {
  label: string;
  icon: ReactNode;
  color: string;
}

export const convoStatusConfig: Record<CallStatus, ConvoStatusView> = {
  CONNECTING: {
    label: "Connecting...",
    icon: <Radio className="h-4 w-4 animate-pulse" />,
    color: "border-amber-400/40 bg-amber-500/15 text-amber-200",
  },
  ACTIVE: {
    label: "Live",
    icon: <Zap className="h-4 w-4 animate-pulse" />,
    color: "border-emerald-400/40 bg-emerald-500/15 text-emerald-200",
  },
  ERROR: {
    label: "Connection Failed",
    icon: <X className="h-4 w-4" />,
    color: "border-red-400/40 bg-red-500/15 text-red-200",
  },
  INACTIVE: {
    label: "Ready",
    icon: (
      <LordIcon
        src="https://cdn.lordicon.com/wjogzler.json"
        trigger="loop"
        colors="primary:#e88c30"
        height={18}
        width={18}
      />
    ),
    color: "border-white/15 bg-white/5 text-white/75",
  },
};
