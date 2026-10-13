import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { renderWithProviders } from "@/tests/support/render";
import { resetTabFormStore } from "@/tests/support/tabForm";
import { useTabFormStore } from "@/store/useTabFormStore";

import Voice from "@/components/ui/NewTabForm/Voice";

function sessionInput() {
  return screen.getByPlaceholderText(/1 - /);
}

describe("Voice", () => {
  beforeEach(() => {
    resetTabFormStore();
  });

  afterEach(() => {
    resetTabFormStore();
  });

  it("requires a whole session of at least one minute", () => {
    renderWithProviders(<Voice />);

    expect(screen.getByText("FREE Plan: Max 2 Mins")).toBeInTheDocument();

    fireEvent.change(sessionInput(), { target: { value: "" } });
    fireEvent.blur(sessionInput());
    expect(screen.getByText("Session length is required")).toBeInTheDocument();

    fireEvent.change(sessionInput(), { target: { value: "0" } });
    expect(screen.getByText("Min 1 minute")).toBeInTheDocument();

    fireEvent.change(sessionInput(), { target: { value: "1.5" } });
    expect(screen.getByText("Please enter a whole number")).toBeInTheDocument();
  });

  it("caps a free session at 2 minutes and shows the plan limit", () => {
    renderWithProviders(<Voice />);

    fireEvent.change(sessionInput(), { target: { value: "10" } });

    expect(sessionInput()).toHaveValue(2);
    expect(
      screen.getByText("Your free plan limit is 2 mins"),
    ).toBeInTheDocument();
    expect(useTabFormStore.getState().sessionLength).toBe(2);
  });

  it("allows 15 minutes on Pro and 60 minutes on King", () => {
    useTabFormStore.getState().setUserPlan("pro");
    const pro = renderWithProviders(<Voice />);

    expect(screen.getByText("PRO Plan: Max 15 Mins")).toBeInTheDocument();
    fireEvent.change(sessionInput(), { target: { value: "15" } });
    expect(sessionInput()).toHaveValue(15);
    expect(screen.queryByText(/plan limit/)).not.toBeInTheDocument();

    pro.unmount();
    useTabFormStore.getState().setUserPlan("king");
    renderWithProviders(<Voice />);

    expect(screen.getByText("KING Plan: Max 60 Mins")).toBeInTheDocument();
    fireEvent.change(sessionInput(), { target: { value: "60" } });
    expect(sessionInput()).toHaveValue(60);
  });

  it("stores the voice that was chosen", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Voice />);

    await user.click(screen.getByRole("button", { name: "female" }));

    expect(useTabFormStore.getState().voice).toBe("female");
  });
});
