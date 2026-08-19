"use client";

import { Crown, LayoutDashboard, RefreshCw, Zap } from "lucide-react";
import { memo } from "react";

import { useConvoStore } from "@/store/use-convo-store";

import { useConvoStage } from "./ConvoStageContext";
import { Button } from "../button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../dialog";

function SessionEndedModal() {
  const { userPlan, onUpgrade, onDashboard } = useConvoStage();
  const showEndModal = useConvoStore((s) => s.showEndModal);
  const setShowEndModal = useConvoStore((s) => s.setShowEndModal);

  const config = {
    free: {
      title: "Time's Up!",
      description:
        "You've reached the 2-minute limit for the Free plan. Upgrade for longer conversations.",
      primaryLabel: "Upgrade to Pro",
      primaryIcon: <Zap className="mr-2 h-4 w-4" />,
      primaryAction: onUpgrade,
    },
    pro: {
      title: "Session Finished",
      description:
        "Your session time has ended. Ready to continue the conversation?",
      primaryLabel: "Talk Again",
      primaryIcon: <RefreshCw className="mr-2 h-4 w-4" />,
      primaryAction: () => setShowEndModal(false),
    },
    king: {
      title: "Session Finished",
      description:
        "Your specified session time is up. Ready for another round?",
      primaryLabel: "Talk Again",
      primaryIcon: <RefreshCw className="mr-2 h-4 w-4" />,
      primaryAction: () => setShowEndModal(false),
    },
  };

  const active = config[userPlan] || config.free;

  return (
    <Dialog open={showEndModal} onOpenChange={setShowEndModal}>
      <DialogContent className="border-white/10 bg-zinc-900 text-white sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
            {userPlan === "king" ? (
              <Crown className="h-6 w-6 text-amber-500" />
            ) : (
              <Zap className="h-6 w-6 text-amber-500" />
            )}
          </div>
          <DialogTitle className="type-title text-center text-xl">
            {active.title}
          </DialogTitle>
          <DialogDescription className="type-body pt-2 text-center text-zinc-400">
            {active.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-6">
          <Button
            className="type-cta h-11 w-full rounded-xl bg-amber-500 text-black transition-all hover:bg-amber-600 active:scale-95"
            onClick={active.primaryAction}
          >
            {active.primaryIcon}
            {active.primaryLabel}
          </Button>

          <Button
            variant="outline"
            className="type-label h-11 w-full rounded-xl border-white/10 bg-transparent text-white transition-all hover:bg-white/5"
            onClick={onDashboard}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default memo(SessionEndedModal);
