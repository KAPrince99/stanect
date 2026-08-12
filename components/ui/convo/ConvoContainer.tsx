"use client";

import { useRouter } from "next/navigation";
import { memo, useCallback, useMemo } from "react";
import { ArrowLeft } from "lucide-react";

import { useConvoData } from "@/hooks/useConvoData";
import { useConvoSession } from "@/hooks/useConvoSession";
import { Button } from "@/components/ui/button";

import DeleteCompanionButton from "../deleteCompanionButton";
import LoadingSpinner from "../LoadingSpinner";
import ConvoPresenter from "./ConvoPresenter";

interface ConvoContainerProps {
  id: string;
}

function ConvoContainer({ id }: ConvoContainerProps) {
  const router = useRouter();
  const { companion, isLoading, userPlan } = useConvoData(id);

  const durationMinutes = Number(companion?.duration) || 2;

  const {
    callStatus,
    isMuted,
    isCallInProgress,
    isCallLive,
    hasAssistantId,
    timeLeftDisplay,
    showEndModal,
    setShowEndModal,
    showTranscript,
    setShowTranscript,
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

  if (isLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  if (!companion) return null;

  return (
    <ConvoPresenter
      companionName={companion.companion_name || "Your AI Companion"}
      callStatus={callStatus}
      showTranscript={showTranscript}
      setShowTranscript={setShowTranscript}
      isDesktop={isDesktop}
      showEndModal={showEndModal}
      setShowEndModal={setShowEndModal}
      userPlan={userPlan}
      isMuted={isMuted}
      isCallInProgress={isCallInProgress}
      isCallLive={isCallLive}
      hasAssistantId={hasAssistantId}
      timeLeftDisplay={timeLeftDisplay}
      loadingMute={loadingMute}
      loadingStart={loadingStart}
      loadingEnd={loadingEnd}
      backAction={backAction}
      deleteAction={deleteAction}
      onStartCall={onStartCall}
      onMuteToggle={onMuteToggle}
      onEndCall={onEndCall}
      onUpgrade={onUpgrade}
      onDashboard={onDashboard}
    />
  );
}

export default memo(ConvoContainer);
