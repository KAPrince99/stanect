import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ConvoStageProvider } from "@/components/ui/convo/ConvoStageContext";
import { convoStage, resetConvoStore } from "@/tests/support/convo";
import { useConvoStore } from "@/store/use-convo-store";

import ConvoActionBar from "@/components/ui/convo/ConvoActionBar";

function renderBar(
  stage = convoStage(),
  status: {
    callStatus?: "INACTIVE" | "CONNECTING" | "ACTIVE" | "ERROR";
    isMuted?: boolean;
  } = {},
) {
  useConvoStore.setState({
    callStatus: status.callStatus ?? "INACTIVE",
    isMuted: status.isMuted ?? false,
  });

  return render(
    <ConvoStageProvider value={stage}>
      <ConvoActionBar />
    </ConvoStageProvider>,
  );
}

describe("ConvoActionBar", () => {
  beforeEach(() => {
    resetConvoStore();
  });

  afterEach(() => {
    resetConvoStore();
  });

  it("keeps start disabled when the companion has no assistant", async () => {
    const user = userEvent.setup();
    const stage = convoStage({ hasAssistantId: false });
    renderBar(stage);

    const start = screen.getByRole("button", { name: "Start Call" });
    expect(start).toBeDisabled();

    await user.click(start);
    expect(stage.onStartCall).not.toHaveBeenCalled();
  });

  it("uses the shared button styles: green start (same size as the dashboard buttons), red end", () => {
    const { unmount } = renderBar(convoStage({ isDesktop: false }));

    const start = screen.getByRole("button", { name: "Start Call" });
    expect(start).toHaveClass(
      "from-success-from",
      "h-11",
      "sm:w-48",
      "rounded-full",
    );
    expect(screen.getByRole("button", { name: "Show transcript" })).toHaveClass(
      "size-12",
      "rounded-full",
    );
    unmount();

    renderBar(convoStage({ isDesktop: true }), { callStatus: "ACTIVE" });
    expect(screen.getByRole("button", { name: "End call" })).toHaveClass(
      "bg-danger",
      "rounded-full",
    );
  });

  it("shows Starting… while the call is connecting", () => {
    renderBar(convoStage(), { callStatus: "CONNECTING" });

    expect(screen.getByRole("button", { name: "Starting…" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Mute" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "End call" })).not.toBeInTheDocument();
  });

  it("replaces start with mute and end once the call is live", async () => {
    const user = userEvent.setup();
    const stage = convoStage({ isDesktop: true });
    renderBar(stage, { callStatus: "ACTIVE" });

    expect(screen.queryByRole("button", { name: "Start Call" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Mute" }));
    await user.click(screen.getByRole("button", { name: "End call" }));

    expect(stage.onMuteToggle).toHaveBeenCalledOnce();
    expect(stage.onEndCall).toHaveBeenCalledOnce();
  });

  it("switches mute to unmute and disables both controls while they are working", () => {
    const stage = convoStage({
      isDesktop: true,
      loadingMute: true,
      loadingEnd: true,
    });
    renderBar(stage, { callStatus: "ACTIVE", isMuted: true });

    expect(screen.getByRole("button", { name: "Unmute" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "End call" })).toBeDisabled();
  });

  it("offers the transcript button on a small screen and hides it on desktop", async () => {
    const user = userEvent.setup();
    const { unmount } = renderBar(convoStage({ isDesktop: false }));

    const transcript = screen
      .getAllByRole("button")
      .find((button) => button.textContent === "");
    expect(transcript).toBeTruthy();
    await user.click(transcript!);
    expect(useConvoStore.getState().showTranscript).toBe(true);

    unmount();
    resetConvoStore();
    renderBar(convoStage({ isDesktop: true }));

    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Start Call" })).toBeEnabled();
  });

  it("hides the transcript button while the call is live", () => {
    renderBar(convoStage({ isDesktop: false }), { callStatus: "ACTIVE" });

    expect(screen.getByRole("button", { name: "Mute" })).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });
});
