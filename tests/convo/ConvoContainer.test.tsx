import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { testMocks } from "@/tests/support/mocks";
import { renderWithProviders } from "@/tests/support/render";
import { resetConvoStore } from "@/tests/support/convo";
import { useGlobeRuntime } from "@/components/ui/GlobeRuntime";
import { useConvoStore } from "@/store/use-convo-store";

import ConvoContainer from "@/components/ui/convo/ConvoContainer";

const convoData = vi.hoisted(() => ({
  companion: null as null | {
    companion_name: string;
    duration: string;
    assistant_id: string;
    owner_id: string;
    avatars?: { image_url: string };
    scene?: string;
  },
  isLoading: false,
  userPlan: "free" as "free" | "pro" | "king",
  userAvatarUrl: "/avatars/ada.jpg" as string | undefined,
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
    userAvatarUrl: convoData.userAvatarUrl,
  }),
}));

vi.mock("@/hooks/useConvoSession", () => ({
  useConvoSession: () => convoSession,
}));

vi.mock("@/hooks/useCompanionTranscript", () => ({
  useCompanionTranscript: () => {},
}));

vi.mock("@/app/(app)/actions/actions", () => ({
  deleteCompanion: vi.fn(),
}));

const mia = {
  companion_name: "Mia",
  duration: "2",
  assistant_id: "asst_1",
  owner_id: "user_test",
  avatars: { image_url: "/avatars/mia.jpg" },
  scene: "Gym",
};

describe("ConvoContainer", () => {
  beforeEach(() => {
    resetConvoStore();
    useGlobeRuntime.getState().reset();
    useGlobeRuntime.setState({ painted: true });
    convoData.companion = mia;
    convoData.isLoading = false;
    convoData.userPlan = "free";
    convoData.userAvatarUrl = "/avatars/ada.jpg";
    convoSession.hasAssistantId = true;
    convoSession.isDesktop = true;
    convoSession.loadingMute = false;
    convoSession.loadingStart = false;
    convoSession.loadingEnd = false;
  });

  afterEach(() => {
    resetConvoStore();
    useGlobeRuntime.getState().reset();
  });

  it("shows the conversation skeleton while the companion is loading", () => {
    convoData.isLoading = true;
    convoData.companion = null;

    const { container } = renderWithProviders(<ConvoContainer id="c1" />);

    expect(
      screen.getByRole("status", { name: "Loading conversation" }),
    ).toBeInTheDocument();
    expect(container.querySelector(".animate-spin")).toBeNull();
    expect(screen.queryByRole("heading", { name: "Mia" })).not.toBeInTheDocument();
  });

  it("leaves the page blank when the companion is missing", () => {
    convoData.companion = null;

    const { container } = renderWithProviders(<ConvoContainer id="c1" />);

    expect(container).toBeEmptyDOMElement();
  });

  it("keeps the conversation skeleton until the globe is ready", async () => {
    useGlobeRuntime.setState({ painted: false });
    renderWithProviders(<ConvoContainer id="c1" />);

    expect(
      screen.getByRole("status", { name: "Loading conversation" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Mia" })).not.toBeInTheDocument();

    act(() => {
      useGlobeRuntime.getState().markPainted();
    });

    expect(
      await screen.findByRole("heading", { name: "Mia" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("status", { name: "Loading conversation" }),
    ).not.toBeInTheDocument();
  });

  it("does not wait on the globe again after it has already painted", () => {
    useGlobeRuntime.setState({ painted: true });
    renderWithProviders(<ConvoContainer id="c1" />);

    expect(screen.getByRole("heading", { name: "Mia" })).toBeInTheDocument();
    expect(
      screen.queryByRole("status", { name: "Loading conversation" }),
    ).not.toBeInTheDocument();
  });

  it("shows the companion as ready and remembers them for later", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ConvoContainer id="c1" />);

    expect(await screen.findByRole("heading", { name: "Mia" })).toBeInTheDocument();
    expect(screen.getByText("Ready")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();

    await waitFor(() => {
      expect(localStorage.getItem("stanect:lastCompanionId")).toBe("c1");
    });

    await user.click(screen.getByRole("button", { name: "Back to dashboard" }));
    expect(testMocks.router.push).toHaveBeenCalledWith("/dashboard");
  });

  it("shows the companion on the left of the globe and the user on the right", async () => {
    renderWithProviders(<ConvoContainer id="c1" />);

    const companion = await screen.findByRole("img", { name: "Mia" });
    const you = screen.getByRole("img", { name: "Your profile picture" });

    expect(companion).toHaveAttribute("src", "/avatars/mia.jpg");
    expect(you).toHaveAttribute("src", "/avatars/ada.jpg");
    expect(companion.parentElement?.parentElement).toHaveClass(
      "left-0",
      "top-1/2",
      "-translate-y-1/2",
    );
    expect(you.parentElement?.parentElement).toHaveClass(
      "right-0",
      "top-1/2",
      "-translate-y-1/2",
    );
  });

  it("shows the scene in the top corner on the same line as Delete", async () => {
    renderWithProviders(<ConvoContainer id="c1" />);

    const scene = await screen.findByText("Gym");
    const deleteButton = screen.getByRole("button", { name: "Delete" });

    expect(scene.closest("div")).toHaveClass(
      "hidden",
      "sm:flex",
      "top-3",
      "sm:top-4",
      "h-9",
    );
    expect(deleteButton.parentElement).toHaveClass("top-3", "sm:top-4");
    expect(screen.getByText("Ready").closest("[data-convo-chrome='status']")).toHaveClass(
      "top-3",
      "sm:top-4",
      "h-9",
    );
  });

  it("lines the portraits up with the scene on the left and Delete on the right", async () => {
    renderWithProviders(<ConvoContainer id="c1" />);

    const sceneRow = (await screen.findByText("Gym")).closest("div");
    const deleteBox = screen.getByRole("button", { name: "Delete" }).parentElement;
    const companion = screen.getByRole("img", { name: "Mia" }).parentElement
      ?.parentElement;
    const you = screen.getByRole("img", { name: "Your profile picture" })
      .parentElement?.parentElement;

    // Portraits sit 0.5rem inside the call area (its padding), so each offset
    // is the corner row's offset minus 0.5rem.
    expect(sceneRow).toHaveClass("sm:left-[4.5rem]", "lg:left-4");
    expect(companion).toHaveClass("sm:left-16", "lg:left-2");
    // Delete: 1rem box inset + 0.625rem button padding = 1.625rem (26px),
    // minus 0.5rem = 18px.
    expect(deleteBox).toHaveClass("sm:right-4");
    expect(you).toHaveClass("sm:right-[18px]");
  });

  it("sizes the globe from leftover stage height", async () => {
    renderWithProviders(<ConvoContainer id="c1" />);

    const companion = await screen.findByRole("img", { name: "Mia" });
    const stage = companion.parentElement?.parentElement?.parentElement;

    expect(stage).toHaveClass("[container-type:size]");
    expect(stage?.querySelector('[class*="100cqh"]')).toBeTruthy();
  });

  it("leaves out the scene when it is empty", async () => {
    convoData.companion = { ...mia, scene: "   " };

    renderWithProviders(<ConvoContainer id="c1" />);

    expect(await screen.findByRole("heading", { name: "Mia" })).toBeInTheDocument();
    expect(screen.queryByText("Gym")).not.toBeInTheDocument();
  });

  it("leaves out a portrait that has no picture", async () => {
    convoData.companion = { ...mia, avatars: undefined };
    convoData.userAvatarUrl = undefined;

    renderWithProviders(<ConvoContainer id="c1" />);

    expect(await screen.findByRole("heading", { name: "Mia" })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Mia" })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("img", { name: "Your profile picture" }),
    ).not.toBeInTheDocument();
  });

  it("uses a fallback name when the companion name is missing", async () => {
    convoData.companion = { ...mia, companion_name: "" };

    renderWithProviders(<ConvoContainer id="c1" />);

    expect(
      await screen.findByRole("heading", { name: "Your AI Companion" }),
    ).toBeInTheDocument();
  });

  it("hides delete while a call is connecting or live", async () => {
    useConvoStore.setState({ callStatus: "CONNECTING" });
    const view = renderWithProviders(<ConvoContainer id="c1" />);

    expect(await screen.findByRole("button", { name: "Starting…" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();

    view.unmount();
    useConvoStore.setState({ callStatus: "ACTIVE", timeLeft: 90 });
    renderWithProviders(<ConvoContainer id="c1" />);

    expect(await screen.findByText("1:30")).toBeInTheDocument();
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
