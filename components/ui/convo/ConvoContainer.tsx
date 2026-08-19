"use client";

import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useMemo } from "react";
import { ArrowLeft } from "lucide-react";

import { useConvoData } from "@/hooks/useConvoData";
import { useConvoSession } from "@/hooks/useConvoSession";
import { setLastCompanionId } from "@/lib/last-companion";
import { useConvoStore } from "@/store/use-convo-store";
import { Button } from "@/components/ui/button";

import DeleteCompanionButton from "../deleteCompanionButton";
import LoadingSpinner from "../LoadingSpinner";
import ConvoPresenter from "./ConvoPresenter";
import { ConvoStageProvider } from "./ConvoStageContext";

interface ConvoContainerProps {
  id: string;
}

function ConvoContainer({ id }: ConvoContainerProps) {
  const router = useRouter();
  const { companion, isLoading, userPlan } = useConvoData(id);
  const callStatus = useConvoStore((s) => s.callStatus);
  const isCallInProgress =
    callStatus === "ACTIVE" || callStatus === "CONNECTING";

  useEffect(() => {
    if (id) setLastCompanionId(id);
  }, [id]);

  const durationMinutes = Number(companion?.duration) || 2;

  const {
    hasAssistantId,
    isDesktop,
    loadingMute,
    loadingStart,
    loadingEnd,
    onStartCall,
    onMuteToggle,
    onEndCall,
  } = useConvoSession({
    assistantId: companion?.assistant_id,
    durationMinutes,
    userId: companion?.owner_id ?? undefined,
  });

  const onUpgrade = useCallback(() => {
    router.push("/pricing");
  }, [router]);

  const onDashboard = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  const deleteAction = useMemo(
    () =>
      !isCallInProgress ? (
        <DeleteCompanionButton id={id} variant="ghost" />
      ) : null,
    [id, isCallInProgress],
  );

  const backAction = useMemo(
    () => (
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-11 rounded-full border border-white/10 bg-white/8 text-white backdrop-blur-md hover:bg-white/10"
        onClick={onDashboard}
        aria-label="Back to dashboard"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
    ),
    [onDashboard],
  );

  const stage = useMemo(
    () => ({
      companionName: companion?.companion_name || "Your AI Companion",
      userPlan,
      hasAssistantId,
      isDesktop,
      loadingMute,
      loadingStart,
      loadingEnd,
      onStartCall,
      onMuteToggle,
      onEndCall,
      onUpgrade,
      onDashboard,
      backAction,
      deleteAction,
    }),
    [
      companion?.companion_name,
      userPlan,
      hasAssistantId,
      isDesktop,
      loadingMute,
      loadingStart,
      loadingEnd,
      onStartCall,
      onMuteToggle,
      onEndCall,
      onUpgrade,
      onDashboard,
      backAction,
      deleteAction,
    ],
  );

  if (isLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  if (!companion) return null;

  return (
    <ConvoStageProvider value={stage}>
      <ConvoPresenter />
    </ConvoStageProvider>
  );
}

export default memo(ConvoContainer);
