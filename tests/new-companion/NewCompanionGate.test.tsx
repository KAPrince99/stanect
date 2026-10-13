import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/tests/support/render";

import NewCompanionGate from "@/components/ui/NewTabForm/NewCompanionGate";

const { getCreateCompanionGate } = vi.hoisted(() => ({
  getCreateCompanionGate: vi.fn(),
}));

vi.mock("@/app/(app)/actions/actions", () => ({
  getCreateCompanionGate,
  getAvatars: vi.fn().mockResolvedValue([]),
}));

describe("NewCompanionGate", () => {
  beforeEach(() => {
    getCreateCompanionGate.mockReset();
  });

  it("shows the setup loading state until the plan check resolves", async () => {
    let resolveGate: (value: { plan: "pro"; count: number }) => void = () => {};
    getCreateCompanionGate.mockReturnValue(
      new Promise((resolve) => {
        resolveGate = resolve;
      }),
    );

    renderWithProviders(<NewCompanionGate userId="user_1" />);

    expect(
      screen.getByRole("status", { name: "Loading companion setup" }),
    ).toBeInTheDocument();

    resolveGate({ plan: "pro", count: 0 });
    await waitFor(() => {
      expect(
        screen.queryByRole("status", { name: "Loading companion setup" }),
      ).not.toBeInTheDocument();
    });
  });

  it("keeps the form closed when the plan check fails", async () => {
    getCreateCompanionGate.mockRejectedValue(new Error("unavailable"));

    renderWithProviders(<NewCompanionGate userId="user_1" />);

    expect(
      await screen.findByText(
        "Unable to verify your plan right now. Please try again.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Avatar" })).not.toBeInTheDocument();
  });

  it("shows the limit alert when the account is at its companion cap", async () => {
    getCreateCompanionGate.mockResolvedValue({ plan: "free", count: 1 });

    renderWithProviders(<NewCompanionGate userId="user_1" />);

    expect(
      await screen.findByRole("heading", { name: "Limit reached" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Your FREE plan allows for 1 companion/),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Avatar" })).not.toBeInTheDocument();
  });

  it("shows the create form when the account is under the cap", async () => {
    getCreateCompanionGate.mockResolvedValue({ plan: "pro", count: 0 });

    renderWithProviders(<NewCompanionGate userId="user_1" />);

    expect(
      await screen.findByRole("button", { name: "Avatar" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Limit reached" }),
    ).not.toBeInTheDocument();
  });
});
