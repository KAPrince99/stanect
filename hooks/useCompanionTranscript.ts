"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { getCompanionSessions } from "@/app/(app)/actions/sessions";
import { useConvoStore } from "@/store/use-convo-store";
import type { SessionProps, SessionTranscriptLine } from "@/types/types";

function toMessages(companionId: string, lines: SessionTranscriptLine[]) {
  return lines.map((line, index) => ({
    id: `${companionId}-${index}`,
    role: line.role,
    content: line.content,
  }));
}

function flattenCompanionTranscript(
  companionId: string,
  rows: SessionProps[],
) {
  const lines = rows
    .filter((row) => row.companion_id === companionId)
    .flatMap((row) => row.transcript ?? []);
  return toMessages(companionId, lines.slice(-200));
}

/** Show this companion's saved transcript. Never another companion's. */
export function useCompanionTranscript(companionId: string) {
  const bindCompanion = useConvoStore((s) => s.bindCompanion);
  const replaceMessages = useConvoStore((s) => s.replaceMessages);
  const markTranscriptReady = useConvoStore((s) => s.markTranscriptReady);

  useEffect(() => {
    if (!companionId) return;
    bindCompanion(companionId);
  }, [bindCompanion, companionId]);

  const { data, isPending, isError, isFetched } = useQuery({
    queryKey: ["sessions", companionId],
    queryFn: () => getCompanionSessions(companionId),
    enabled: Boolean(companionId),
  });

  useEffect(() => {
    if (!companionId) return;

    const state = useConvoStore.getState();
    const live =
      state.callStatus === "ACTIVE" || state.callStatus === "CONNECTING";
    if (live) {
      markTranscriptReady();
      return;
    }

    if (isError) {
      markTranscriptReady();
      return;
    }

    if (isPending || !isFetched) return;
    if (state.companionId !== companionId) return;

    replaceMessages(flattenCompanionTranscript(companionId, data ?? []));
  }, [
    companionId,
    data,
    isError,
    isFetched,
    isPending,
    markTranscriptReady,
    replaceMessages,
  ]);
}
