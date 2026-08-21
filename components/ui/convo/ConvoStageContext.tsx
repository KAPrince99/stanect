"use client";

import { createContext, useContext, type ReactNode } from "react";

export type ConvoStageContextValue = {
  companionId: string;
  companionName: string;
  userPlan: "free" | "pro" | "king";
  hasAssistantId: boolean;
  isDesktop: boolean;
  loadingMute: boolean;
  loadingStart: boolean;
  loadingEnd: boolean;
  onStartCall: () => void | Promise<void>;
  onMuteToggle: () => void | Promise<void>;
  onEndCall: () => void | Promise<void>;
  onUpgrade: () => void;
  onDashboard: () => void;
  backAction?: ReactNode;
  deleteAction?: ReactNode;
};

const ConvoStageContext = createContext<ConvoStageContextValue | null>(null);

export function ConvoStageProvider({
  value,
  children,
}: {
  value: ConvoStageContextValue;
  children: ReactNode;
}) {
  return (
    <ConvoStageContext.Provider value={value}>
      {children}
    </ConvoStageContext.Provider>
  );
}

export function useConvoStage() {
  const ctx = useContext(ConvoStageContext);
  if (!ctx) {
    throw new Error("useConvoStage must be used within ConvoStageProvider");
  }
  return ctx;
}
