import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { testMocks } from "@/tests/support/mocks";
import { renderWithProviders } from "@/tests/support/render";
import { resetConvoStore } from "@/tests/support/convo";
import { useConvoStore } from "@/store/use-convo-store";

import ConvoContainer from "@/components/ui/convo/ConvoContainer";

const convoData = vi.hoisted(() => ({
  companion: null as null | {
    companion_name: string;
    duration: string;
    assistant_id: string;
    owner_id: string;
  },
  isLoading: false,
  userPlan: "free" as "free" | "pro" | "king",
}));

const convoSession = vi.hoisted(() => ({
  hasAssistantId: true,
  isDesktop: true,
  loadingMute: false,
  loadingStart: false,
  loadingEnd: false,
  onStartCall: vi.fn(),
  onMuteToggle: vi.fn(),
  onEndCall: vi.fn(),
}));

vi.mock("@/hooks/useConvoData", () => ({
  useConvoData: () => ({
    companion: convoData.companion,
    isLoading: convoData.isLoading,
    userPlan: convoData.userPlan,
  }),
}));

vi.mock("@/hooks/useConvoSession", () => ({
  useConvoSession: () => convoSession,
}));

vi.mock("@/hooks/useCompanionTranscript", () => ({
  useCompanionTranscript: () => {},
}));

vi.mock("@/components/ui/GlobeCanvas", () => ({
  default: () => null,
}));

vi.mock("@/app/(app)/actions/actions", () => ({
  deleteCompanion: vi.fn(),
}));

const mia = {
  companion_name: "Mia",
  duration: "2",
  assistant_id: "asst_1",
  owner_id: "user_test",
};

describe("ConvoContainer", () => {
  beforeEach(() => {
    resetConvoStore();
    convoData.companion = mia;
    convoData.isLoading = false;
    convoData.userPlan = "free";
    convoSession.hasAssistantId = true;
    convoSession.isDesktop = true;
    convoSession.loadingMute = false;
    convoSession.loadingStart = false;
    convoSession.loadingEnd = false;
  });

  afterEach(() => {
    resetConvoStore();
  });

  it("shows a spinner while the companion is loading", () => {
    convoData.isLoading = true;
    convoData.companion = null;

    const { container } = renderWithProviders(<ConvoContainer id="c1" />);

    expect(container.querySelector(".animate-spin")).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Mia" })).not.toBeInTheDocument();
  });

  it("leaves the page blank when the companion is missing", () => {
    convoData.companion = null;

    const { container } = renderWithProviders(<ConvoContainer id="c1" />);

    expect(container).toBeEmptyDOMElement();
  });

  it("shows the companion as ready and remembers them for later", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ConvoContainer id="c1" />);

    expect(screen.getByRole("heading", { name: "Mia" })).toBeInTheDocument();
    expect(screen.getByText("Ready")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();

    await waitFor(() => {
      expect(localStorage.getItem("stanect:lastCompanionId")).toBe("c1");
    });

    await user.click(screen.getByRole("button", { name: "Back to dashboard" }));
    expect(testMocks.router.push).toHaveBeenCalledWith("/dashboard");
  });

  it("uses a fallback name when the companion name is missing", () => {
    convoData.companion = { ...mia, companion_name: "" };

    renderWithProviders(<ConvoContainer id="c1" />);

    expect(
      screen.getByRole("heading", { name: "Your AI Companion" }),
    ).toBeInTheDocument();
  });

  it("hides delete while a call is connecting or live", () => {
    useConvoStore.setState({ callStatus: "CONNECTING" });
    const view = renderWithProviders(<ConvoContainer id="c1" />);

    expect(screen.getByRole("button", { name: "Starting…" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();

    view.unmount();
    useConvoStore.setState({ callStatus: "ACTIVE", timeLeft: 90 });
    renderWithProviders(<ConvoContainer id="c1" />);

    expect(screen.getByText("1:30")).toBeInTheDocument();
    expect(screen.getByText(/Live ·/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mute" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "End call" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();
  });

  it("sends Upgrade to Pro to pricing", async () => {
    const user = userEvent.setup();
    useConvoStore.setState({ showEndModal: true });

    renderWithProviders(<ConvoContainer id="c1" />);

    await user.click(await screen.findByRole("button", { name: "Upgrade to Pro" }));

    expect(testMocks.router.push).toHaveBeenCalledWith("/pricing");
  });
});
