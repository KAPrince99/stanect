"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, LayoutDashboard, Zap, RefreshCw } from "lucide-react";

interface SessionEndedModalProps {
  showEndModal: boolean;
  setShowEndModal: (show: boolean) => void;
  userPlan: "free" | "pro" | "king";
}

export default function SessionEndedModal({
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
          <DialogTitle className="text-center text-2xl font-bold">
            {active.title}
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-400 pt-2 text-base">
            {active.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-6">
          <Button
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold h-12 rounded-xl transition-all active:scale-95"
            onClick={active.primaryAction}
          >
            {active.primaryIcon}
            {active.primaryLabel}
          </Button>

          <Button
            variant="outline"
            className="w-full bg-transparent border-white/10 hover:bg-white/5 text-white h-12 rounded-xl transition-all"
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
