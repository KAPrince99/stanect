import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/render";

import ConvoAccessGate from "./ConvoAccessGate";

const { fetchUserNecessities } = vi.hoisted(() => ({
  fetchUserNecessities: vi.fn(),
}));

vi.mock("@/app/(app)/actions/actions", () => ({
  fetchUserNecessities,
}));

function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

describe("ConvoAccessGate", () => {
  beforeEach(() => {
    fetchUserNecessities.mockReset();
  });

  it("hides the call screen while access is loading", () => {
    fetchUserNecessities.mockReturnValue(new Promise(() => {}));

    const { container } = renderWithProviders(
      <ConvoAccessGate userId="user_1">
        <p>Call stage</p>
      </ConvoAccessGate>,
    );

    expect(screen.queryByText("Call stage")).not.toBeInTheDocument();
    expect(container.querySelector(".animate-spin")).toBeTruthy();
  });

  it("fails closed when the access check errors", async () => {
    fetchUserNecessities.mockRejectedValue(new Error("unavailable"));

    renderWithProviders(
      <ConvoAccessGate userId="user_1">
        <p>Call stage</p>
      </ConvoAccessGate>,
    );

    expect(
      await screen.findByRole(
        "heading",
        { name: "Couldn't verify access" },
        { timeout: 3000 },
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText("Call stage")).not.toBeInTheDocument();
  });

  it("shows the trial guard when the free trial is over", async () => {
    fetchUserNecessities.mockResolvedValue({
      plan: "free",
      created_at: daysAgo(10),
      daily_seconds_used: 0,
      last_usage_date: todayKey(),
    });

    renderWithProviders(
      <ConvoAccessGate userId="user_1">
        <p>Call stage</p>
      </ConvoAccessGate>,
    );

    expect(
      await screen.findByRole("heading", { name: "Trial period ended" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Call stage")).not.toBeInTheDocument();
  });

  it("shows the daily-limit guard when today's credit is spent", async () => {
    fetchUserNecessities.mockResolvedValue({
      plan: "free",
      created_at: daysAgo(1),
      daily_seconds_used: 360,
      last_usage_date: todayKey(),
    });

    renderWithProviders(
      <ConvoAccessGate userId="user_1">
        <p>Call stage</p>
      </ConvoAccessGate>,
    );

    expect(
      await screen.findByRole("heading", { name: "Daily limit reached" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Call stage")).not.toBeInTheDocument();
  });

  it("shows the call screen for an allowed account", async () => {
    fetchUserNecessities.mockResolvedValue({
      plan: "pro",
      created_at: daysAgo(30),
      daily_seconds_used: 10_000,
      last_usage_date: todayKey(),
    });

    renderWithProviders(
      <ConvoAccessGate userId="user_1">
        <p>Call stage</p>
      </ConvoAccessGate>,
    );

    expect(await screen.findByText("Call stage")).toBeInTheDocument();
  });

  it("opens the call screen after a failed check is retried", async () => {
    const user = userEvent.setup();
    fetchUserNecessities
      .mockRejectedValueOnce(new Error("unavailable"))
      .mockRejectedValueOnce(new Error("unavailable"))
      .mockResolvedValue({
        plan: "pro",
        created_at: daysAgo(1),
        daily_seconds_used: 0,
        last_usage_date: todayKey(),
      });

    renderWithProviders(
      <ConvoAccessGate userId="user_1">
        <p>Call stage</p>
      </ConvoAccessGate>,
    );

    await user.click(
      await screen.findByRole(
        "button",
        { name: /Try again/ },
        { timeout: 3000 },
      ),
    );

    expect(await screen.findByText("Call stage")).toBeInTheDocument();
  });
});
