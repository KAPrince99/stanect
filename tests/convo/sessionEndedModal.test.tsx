import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ConvoStageProvider } from "@/components/ui/convo/ConvoStageContext";
import { convoStage, resetConvoStore } from "@/tests/support/convo";
import { useConvoStore } from "@/store/use-convo-store";

import SessionEndedModal from "@/components/ui/convo/sessionEndedModal";

function renderModal(userPlan: "free" | "pro" | "king") {
  const stage = convoStage({ userPlan });
  useConvoStore.setState({ showEndModal: true });

  render(
    <ConvoStageProvider value={stage}>
      <SessionEndedModal />
    </ConvoStageProvider>,
  );

  return stage;
}

describe("SessionEndedModal", () => {
  beforeEach(() => {
    resetConvoStore();
  });

  afterEach(() => {
    resetConvoStore();
  });

  it("offers an upgrade when a free session ends", async () => {
    const user = userEvent.setup();
    const stage = renderModal("free");

    expect(screen.getByRole("heading", { name: "Time's Up!" })).toBeInTheDocument();
    expect(
      screen.getByText(
        "You've reached the 2-minute limit for the Free plan. Upgrade for longer conversations.",
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Upgrade to Pro" }));
    await user.click(screen.getByRole("button", { name: "Back to Dashboard" }));

    expect(stage.onUpgrade).toHaveBeenCalledOnce();
    expect(stage.onDashboard).toHaveBeenCalledOnce();
  });

  it("lets a Pro session start again", async () => {
    const user = userEvent.setup();
    renderModal("pro");

    expect(
      screen.getByRole("heading", { name: "Session Finished" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Your session time has ended. Ready to continue the conversation?",
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Talk Again" }));

    expect(useConvoStore.getState().showEndModal).toBe(false);
    expect(
      screen.queryByRole("heading", { name: "Session Finished" }),
    ).not.toBeInTheDocument();
  });

  it("lets a King session start again", async () => {
    const user = userEvent.setup();
    const stage = renderModal("king");

    expect(
      screen.getByText(
        "Your specified session time is up. Ready for another round?",
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Back to Dashboard" }));

    expect(stage.onDashboard).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Talk Again" })).toBeInTheDocument();
  });
});
