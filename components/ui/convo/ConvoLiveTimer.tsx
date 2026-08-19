"use client";

import { memo } from "react";

import { useConvoStore } from "@/store/use-convo-store";

function formatTimeLeft(timeLeft: number | null) {
  if (timeLeft === null) return "";
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/** Only this leaf re-renders on the 1s countdown tick. */
function ConvoLiveTimer() {
  const timeLeft = useConvoStore((s) => s.timeLeft);
  const formatted = formatTimeLeft(timeLeft);

  if (!formatted) return null;

  return <span className="tabular-nums">{formatted}</span>;
}

export default memo(ConvoLiveTimer);
