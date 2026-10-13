"use client";

import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useConvoData } from "@/hooks/useConvoData";
import { useConvoSession } from "@/hooks/useConvoSession";
import { useCompanionTranscript } from "@/hooks/useCompanionTranscript";
import { setLastCompanionId } from "@/lib/last-companion";
import { useConvoStore } from "@/store/use-convo-store";
import BackButton from "@/components/ui/BackButton";

import DeleteCompanionButton from "../deleteCompanionButton";
import ConvoPresenter from "./ConvoPresenter";
import { ConvoRouteLoading } from "./ConvoSkeleton";
import { ConvoStageProvider } from "./ConvoStageContext";

interface ConvoContainerProps {
  id: string;
}

function ConvoContainer({ id }: ConvoContainerProps) {
  const router = useRouter();
  const { companion, isLoading, userPlan, userAvatarUrl } = useConvoData(id);
  const callStatus = useConvoStore((s) => s.callStatus);
  const isCallInProgress =
    callStatus === "ACTIVE" || callStatus === "CONNECTING";
  const [readyForId, setReadyForId] = useState<string | null>(null);
  const globeReady = readyForId === id;
  const onGlobeReady = useCallback(() => setReadyForId(id), [id]);
  const showSkeleton = isLoading || !globeReady;

  useEffect(() => {
    if (id) setLastCompanionId(id);
  }, [id]);

  useEffect(() => {
    void import("@/components/ui/GlobeCanvas");
  }, []);

  useCompanionTranscript(id);

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
    () => <BackButton onClick={onDashboard} />,
    [onDashboard],
  );

  const stage = useMemo(
    () => ({
      companionId: id,
      companionName: companion?.companion_name || "Your AI Companion",
      companionScene: companion?.scene ?? null,
      companionAvatarUrl: companion?.avatars?.image_url ?? null,
      userAvatarUrl: userAvatarUrl ?? null,
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
      id,
      companion?.companion_name,
      companion?.scene,
      companion?.avatars?.image_url,
      userAvatarUrl,
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

  if (!companion && !isLoading) return null;

  return (
    <div className="relative flex h-full min-h-0 w-full flex-1 flex-col">
      {companion ? (
        <div
          aria-hidden={!globeReady}
          className="flex h-full min-h-0 w-full flex-1 flex-col"
        >
          <ConvoStageProvider value={stage}>
            <ConvoPresenter onGlobeReady={onGlobeReady} />
          </ConvoStageProvider>
        </div>
      ) : null}

      {showSkeleton ? (
        <div className="absolute inset-0 z-40 flex flex-col">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-backdrop-from via-backdrop-via to-backdrop-to" />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
          <div className="relative flex h-full min-h-0 flex-1 flex-col">
            <ConvoRouteLoading />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default memo(ConvoContainer);
