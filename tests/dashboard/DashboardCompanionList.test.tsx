import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { CompanionProps } from "@/types/types";
import { testMocks } from "@/tests/support/mocks";
import { renderWithProviders } from "@/tests/support/render";

import DashboardCompanionList from "@/components/ui/HomeDashboard/DashboardCompanionList";

const { getCompanions, getUser } = vi.hoisted(() => ({
  getCompanions: vi.fn(),
  getUser: vi.fn(),
}));

vi.mock("@/app/(app)/actions/actions", () => ({
  getCompanions,
  getUser,
}));

function companion(id: string, name: string): CompanionProps {
  return {
    id,
    avatar_id: "a1",
    avatars: { image_url: `/${id}.png` },
    companion_name: name,
    scene: "Gym",
    voice: "female",
    duration: "2",
    owner_id: "user_test",
    country: "",
    username: "Ada",
    assistant_id: "asst_1",
  };
}

const mia = companion("c1", "Mia");
const alex = companion("c2", "Alex");
const sam = companion("c3", "Sam");

describe("DashboardCompanionList", () => {
  beforeEach(() => {
    getCompanions.mockReset();
    getUser.mockReset();
    localStorage.removeItem("stanect:lastCompanionId");
    getUser.mockResolvedValue({ plan: "free" });
  });

  it("announces loading until companions and the account are ready", () => {
    getCompanions.mockReturnValue(new Promise(() => {}));
    getUser.mockReturnValue(new Promise(() => {}));

    renderWithProviders(<DashboardCompanionList userId="user_test" />);

    expect(
      screen.getByRole("status", { name: "Loading dashboard" }),
    ).toBeInTheDocument();
  });

  it("opens companion setup from an empty dashboard", async () => {
    const user = userEvent.setup();
    getCompanions.mockResolvedValue([]);

    renderWithProviders(<DashboardCompanionList userId="user_test" />);

    await user.click(
      await screen.findByRole("button", { name: "Start Companion Setup" }),
    );

    expect(testMocks.router.push).toHaveBeenCalledWith("/new");
  });

  it("continues the last companion that is still in the list", async () => {
    localStorage.setItem("stanect:lastCompanionId", "c2");
    getCompanions.mockResolvedValue([mia, alex]);

    renderWithProviders(<DashboardCompanionList userId="user_test" />);

    expect(await screen.findByText("Welcome back, Ada")).toBeInTheDocument();
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Continue" })).toHaveAttribute(
      "href",
      "/dashboard/c2",
    );
  });

  it("continues the first companion when the saved one is gone", async () => {
    localStorage.setItem("stanect:lastCompanionId", "gone");
    getCompanions.mockResolvedValue([mia, alex]);

    renderWithProviders(<DashboardCompanionList userId="user_test" />);

    expect(await screen.findByRole("link", { name: "Continue" })).toHaveAttribute(
      "href",
      "/dashboard/c1",
    );
  });

  it("shows a Pro or King badge for a paid account", async () => {
    getCompanions.mockResolvedValue([mia]);
    getUser.mockResolvedValue({ plan: "pro" });
    const pro = renderWithProviders(<DashboardCompanionList userId="user_test" />);

    expect(await screen.findByText("Pro")).toBeInTheDocument();

    pro.unmount();
    getUser.mockResolvedValue({ plan: "king" });
    renderWithProviders(<DashboardCompanionList userId="user_test" />);

    expect(await screen.findByText("King")).toBeInTheDocument();
  });

  it("offers another companion only while the plan still has room", async () => {
    getCompanions.mockResolvedValue([mia]);
    getUser.mockResolvedValue({ plan: "free" });
    const free = renderWithProviders(<DashboardCompanionList userId="user_test" />);

    expect(
      await screen.findAllByRole("link", { name: "Create another companion" }),
    ).toHaveLength(2);
    expect(
      screen.queryByRole("link", { name: "Create companion" }),
    ).not.toBeInTheDocument();

    free.unmount();
    getCompanions.mockResolvedValue([mia, alex, sam]);
    getUser.mockResolvedValue({ plan: "pro" });
    renderWithProviders(<DashboardCompanionList userId="user_test" />);

    expect(
      await screen.findByRole("link", { name: "Create companion" }),
    ).toHaveAttribute("href", "/new");
  });
});
