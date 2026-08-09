"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../dialog";
import { Button } from "../button";
import { Crown, LayoutDashboard, Zap, RefreshCw } from "lucide-react";
import { memo } from "react";

interface SessionEndedModalProps {
  showEndModal: boolean;
  setShowEndModal: (show: boolean) => void;
  userPlan: "free" | "pro" | "king";
}

function SessionEndedModal({
  showEndModal,
  setShowEndModal,
  userPlan,
}: SessionEndedModalProps) {
  const router = useRouter();

  const config = {
    free: {
      title: "Time's Up!",
      description:
        "You've reached the 2-minute limit for the Free plan. Upgrade for longer conversations.",
      primaryLabel: "Upgrade to Pro",
      primaryIcon: <Zap className="w-4 h-4 mr-2" />,
      primaryAction: () => router.push("/pricing"),
    },
    pro: {
      title: "Session Finished",
      description:
        "Your session time has ended. Ready to continue the conversation?",
      primaryLabel: "Talk Again",
      primaryIcon: <RefreshCw className="w-4 h-4 mr-2" />,
      primaryAction: () => setShowEndModal(false),
    },
    king: {
      title: "Session Finished",
      description:
        "Your specified session time is up. Ready for another round?",
      primaryLabel: "Talk Again",
      primaryIcon: <RefreshCw className="w-4 h-4 mr-2" />,
      primaryAction: () => setShowEndModal(false),
    },
  };

  const active = config[userPlan] || config.free;

  return (
    <Dialog open={showEndModal} onOpenChange={setShowEndModal}>
      <DialogContent className="bg-zinc-900 border-white/10 text-white sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto bg-amber-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            {userPlan === "king" ? (
              <Crown className="w-6 h-6 text-amber-500" />
            ) : (
              <Zap className="w-6 h-6 text-amber-500" />
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
            onClick={() => router.push("/dashboard")}
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default memo(SessionEndedModal);
