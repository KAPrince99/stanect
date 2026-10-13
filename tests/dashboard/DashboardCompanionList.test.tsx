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

function companion(id: string, name: string, scene = "Gym"): CompanionProps {
  return {
    id,
    avatar_id: "a1",
    avatars: { image_url: `/${id}.png` },
    companion_name: name,
    scene,
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

  it("announces loading until companions are ready", () => {
    getCompanions.mockReturnValue(new Promise(() => {}));

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

  it("continues the last companion in a thin row above search", async () => {
    localStorage.setItem("stanect:lastCompanionId", "c2");
    getCompanions.mockResolvedValue([mia, alex]);

    renderWithProviders(<DashboardCompanionList userId="user_test" />);

    expect(await screen.findByRole("link", { name: "Continue" })).toHaveAttribute(
      "href",
      "/dashboard/c2",
    );
    expect(screen.getByRole("link", { name: "Continue" })).toHaveClass(
      "h-8",
      "!text-sm",
    );
    expect(
      screen.getByRole("link", { name: "Continue" }).querySelector("svg"),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Mia" })).toBeInTheDocument();
    expect(screen.queryByText(/Welcome back/)).not.toBeInTheDocument();
    expect(screen.queryByText("Free")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Create companion" }),
    ).not.toBeInTheDocument();
  });

  it("offers Create companion on a full row when the plan still has room", async () => {
    getCompanions.mockResolvedValue([mia, alex, sam]);
    getUser.mockResolvedValue({ plan: "pro" });

    renderWithProviders(<DashboardCompanionList userId="user_test" />);

    expect(await screen.findByRole("link", { name: "Create companion" })).toHaveAttribute(
      "href",
      "/new",
    );
    expect(screen.getByRole("link", { name: "Create companion" })).toHaveClass(
      "h-8",
      "!text-sm",
    );
  });

  it("does not show a plan badge", async () => {
    getCompanions.mockResolvedValue([mia]);

    renderWithProviders(<DashboardCompanionList userId="user_test" />);

    expect(await screen.findByRole("heading", { name: "Mia" })).toBeInTheDocument();
    expect(screen.queryByText("Pro")).not.toBeInTheDocument();
    expect(screen.queryByText("King")).not.toBeInTheDocument();
    expect(screen.queryByText("Free")).not.toBeInTheDocument();
  });

  it("offers another companion from ghost cards while the row is not full", async () => {
    getCompanions.mockResolvedValue([mia]);

    renderWithProviders(<DashboardCompanionList userId="user_test" />);

    expect(
      await screen.findAllByRole("link", { name: "Create another companion" }),
    ).toHaveLength(2);
    expect(
      screen.queryByRole("link", { name: "Create companion" }),
    ).not.toBeInTheDocument();
  });

  it("does not show search on an empty dashboard or with a single companion", async () => {
    getCompanions.mockResolvedValue([]);
    const empty = renderWithProviders(
      <DashboardCompanionList userId="user_test" />,
    );

    expect(
      await screen.findByRole("heading", { name: "Create your first companion" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: "Search companions" }),
    ).not.toBeInTheDocument();
    empty.unmount();

    getCompanions.mockResolvedValue([mia]);
    renderWithProviders(<DashboardCompanionList userId="user_test" />);

    expect(await screen.findByRole("heading", { name: "Mia" })).toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: "Search companions" }),
    ).not.toBeInTheDocument();
  });

  it("filters the grid by name after a pause", async () => {
    const user = userEvent.setup();
    getCompanions.mockResolvedValue([mia, alex]);

    renderWithProviders(<DashboardCompanionList userId="user_test" />);

    const search = await screen.findByRole("textbox", {
      name: "Search companions",
    });
    await user.type(search, "Mia");
    expect(screen.getByRole("heading", { name: "Alex" })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("1 of 2")).toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "Alex" })).not.toBeInTheDocument();
    });
    expect(screen.getByRole("heading", { name: "Mia" })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Create another companion" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Mia" }).querySelector("mark")).toBeNull();
  });

  it("filters by scene and shows no-results without the setup wizard", async () => {
    const user = userEvent.setup();
    getCompanions.mockResolvedValue([mia, companion("c2", "Alex", "Park")]);

    renderWithProviders(<DashboardCompanionList userId="user_test" />);

    const search = await screen.findByRole("textbox", {
      name: "Search companions",
    });
    await user.type(search, "park");

    await waitFor(() => {
      expect(screen.getByText("1 of 2")).toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "Mia" })).not.toBeInTheDocument();
    });
    expect(screen.getByRole("heading", { name: "Alex" })).toBeInTheDocument();

    await user.clear(search);
    await user.type(search, "zzz");

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "No companions match “zzz”" }),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByRole("heading", { name: "Create your first companion" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^Clear$/ }));
    expect(search).toHaveValue("");
    expect(screen.getByRole("heading", { name: "Mia" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Alex" })).toBeInTheDocument();
  });

  it("focuses with / and clears with Escape", async () => {
    const user = userEvent.setup();
    getCompanions.mockResolvedValue([mia, alex]);

    renderWithProviders(<DashboardCompanionList userId="user_test" />);

    const search = await screen.findByRole("textbox", {
      name: "Search companions",
    });
    await user.type(search, "Alex");
    expect(search).toHaveValue("Alex");

    await user.keyboard("{Escape}");
    expect(search).toHaveValue("");
    expect(screen.getByRole("heading", { name: "Mia" })).toBeInTheDocument();

    search.blur();
    await user.keyboard("/");
    expect(search).toHaveFocus();
  });
});
