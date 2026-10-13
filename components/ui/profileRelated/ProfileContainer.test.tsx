import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/render";

import ProfileContainer from "./ProfileContainer";

const { getUser, getCompanions, fetchSubscriptionStatus } = vi.hoisted(() => ({
  getUser: vi.fn(),
  getCompanions: vi.fn(),
  fetchSubscriptionStatus: vi.fn(),
}));

vi.mock("@/app/(app)/actions/actions", () => ({
  getUser,
  getCompanions,
}));

vi.mock("@/app/(app)/actions/subs", () => ({
  fetchSubscriptionStatus,
}));

vi.mock("@/app/(app)/actions/update", () => ({
  updateProfile: vi.fn(),
}));

function profileRecord(overrides: Record<string, unknown> = {}) {
  return {
    name: "Ada Lovelace",
    email: "ada@example.com",
    country: "London",
    plan: "free",
    status: "active",
    total_lifetime_seconds: 3661,
    daily_seconds_used: 90,
    profile_picture: "/avatars/ada.jpg",
    ...overrides,
  };
}

describe("ProfileContainer", () => {
  beforeEach(() => {
    getUser.mockReset();
    getCompanions.mockReset();
    fetchSubscriptionStatus.mockReset();
    getCompanions.mockResolvedValue([]);
    fetchSubscriptionStatus.mockResolvedValue({ plan: "free", status: "active" });
  });

  it("shows a spinner while the profile is loading", () => {
    getUser.mockReturnValue(new Promise(() => {}));

    const { container } = renderWithProviders(
      <ProfileContainer userId="user_test" />,
    );

    expect(container.querySelector(".animate-spin")).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Plan & billing" })).not.toBeInTheDocument();
  });

  it("shows an error when the profile cannot be loaded", async () => {
    getUser.mockRejectedValue(new Error("down"));

    renderWithProviders(<ProfileContainer userId="user_test" />);

    expect(
      await screen.findByText("Unable to load profile details right now."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Plan & billing" })).not.toBeInTheDocument();
  });

  it("shows a free plan without billing actions", async () => {
    getUser.mockResolvedValue(profileRecord());

    renderWithProviders(<ProfileContainer userId="user_test" />);

    expect(await screen.findByText("Free Plan")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Upgrade Plan" })).toHaveAttribute(
      "href",
      "/pricing",
    );
    expect(screen.getByText("1 hrs 1 min 1 secs")).toBeInTheDocument();
    expect(screen.getByText("1m 30s / 6m 0s")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Manage billing" })).not.toBeInTheDocument();
  });

  it("shows billing actions for Pro and King", async () => {
    getUser.mockResolvedValue(profileRecord({ plan: "pro" }));
    fetchSubscriptionStatus.mockResolvedValue({ plan: "pro", status: "active" });

    const { unmount } = renderWithProviders(
      <ProfileContainer userId="user_test" />,
    );

    expect(await screen.findByText("Pro Member")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Change Plan" })).toHaveAttribute(
      "href",
      "/pricing",
    );
    expect(screen.getByRole("button", { name: "Manage billing" })).toBeInTheDocument();
    expect(screen.getByText("Unlimited")).toBeInTheDocument();
    expect(screen.getByText("15-min sessions")).toBeInTheDocument();

    unmount();
    getUser.mockResolvedValue(profileRecord({ plan: "king" }));
    fetchSubscriptionStatus.mockResolvedValue({ plan: "king", status: "active" });

    renderWithProviders(<ProfileContainer userId="user_test" />);

    expect(await screen.findByText("King Member")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Manage billing" })).toBeInTheDocument();
    expect(screen.getByText("60-min sessions")).toBeInTheDocument();
  });

  it("treats a missing plan as Free", async () => {
    getUser.mockResolvedValue(profileRecord({ plan: null }));
    fetchSubscriptionStatus.mockResolvedValue({ plan: null, status: "active" });

    renderWithProviders(<ProfileContainer userId="user_test" />);

    expect(await screen.findByText("Free Plan")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Upgrade Plan" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Manage billing" })).not.toBeInTheDocument();
  });
});
