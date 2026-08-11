"use client";

import { useRouter } from "next/navigation";
import { memo, useCallback } from "react";

import { useConvoData } from "@/hooks/useConvoData";
import { useConvoSession } from "@/hooks/useConvoSession";

import LoadingSpinner from "../LoadingSpinner";
import ConvoPresenter from "./ConvoPresenter";

interface ConvoContainerProps {
  id: string;
}

function ConvoContainer({ id }: ConvoContainerProps) {
  const router = useRouter();
  const { companion, isLoading, userPlan } = useConvoData(id);
  const {
    callStatus,
    showEndModal,
    setShowEndModal,
    showTranscript,
    setShowTranscript,
    isDesktop,
  } = useConvoSession();

  const onUpgrade = useCallback(() => {
    router.push("/pricing");
  }, [router]);

  const onDashboard = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  if (isLoading) return <LoadingSpinner />;
  if (!companion) return null;

  return (
    <ConvoPresenter
      companion={companion}
      id={id}
      callStatus={callStatus}
      showTranscript={showTranscript}
      setShowTranscript={setShowTranscript}
      isDesktop={isDesktop}
      showEndModal={showEndModal}
      setShowEndModal={setShowEndModal}
      userPlan={userPlan}
      onUpgrade={onUpgrade}
      onDashboard={onDashboard}
    />
  );
}

export default memo(ConvoContainer);
