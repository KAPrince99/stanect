import type { ConvoStageContextValue } from "@/components/ui/convo/ConvoStageContext";
import { useConvoStore } from "@/store/use-convo-store";
import { vi } from "vitest";

export function resetConvoStore() {
  localStorage.removeItem("stanect-convo-sync");
  localStorage.removeItem("stanect:lastCompanionId");
  useConvoStore.setState({
    callStatus: "INACTIVE",
    isMuted: false,
    messages: [],
    timeLeft: null,
    showEndModal: false,
    showTranscript: false,
    activeCallId: null,
    companionId: null,
  });
}

export function convoStage(
  overrides: Partial<ConvoStageContextValue> = {},
): ConvoStageContextValue {
  return {
    companionId: "c1",
    companionName: "Mia",
    userPlan: "free",
    hasAssistantId: true,
    isDesktop: false,
    loadingMute: false,
    loadingStart: false,
    loadingEnd: false,
    onStartCall: vi.fn(),
    onMuteToggle: vi.fn(),
    onEndCall: vi.fn(),
    onUpgrade: vi.fn(),
    onDashboard: vi.fn(),
    ...overrides,
  };
}
