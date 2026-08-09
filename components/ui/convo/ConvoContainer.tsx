"use client";

import { memo } from "react";

import { useConvoData } from "@/hooks/useConvoData";
import { useConvoSession } from "@/hooks/useConvoSession";

import LoadingSpinner from "../LoadingSpinner";
import ConvoPresenter from "./ConvoPresenter";

interface ConvoContainerProps {
  id: string;
}

function ConvoContainer({ id }: ConvoContainerProps) {
  const { companion, isLoading, userPlan } = useConvoData(id);
  const {
    callStatus,
    showEndModal,
    setShowEndModal,
    showTranscript,
    setShowTranscript,
    isDesktop,
  } = useConvoSession();

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
    />
  );
}

export default memo(ConvoContainer);
