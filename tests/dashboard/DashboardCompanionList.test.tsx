import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { CompanionProps } from "@/types/types";
import { testMocks } from "@/tests/support/mocks";
import { renderWithProviders } from "@/tests/support/render";

import DashboardCompanionList from "@/components/ui/HomeDashboard/DashboardCompanionList";

const {
  getCompanions,
  getUser,
  toggleFavoriteCompanion,
  importFavoriteCompanions,
} = vi.hoisted(() => ({
  getCompanions: vi.fn(),
  getUser: vi.fn(),
  toggleFavoriteCompanion: vi.fn(),
  importFavoriteCompanions: vi.fn(),
}));

vi.mock("@/app/(app)/actions/actions", () => ({
  getCompanions,
  getUser,
  toggleFavoriteCompanion,
  importFavoriteCompanions,
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
  let favoriteIds: string[] = [];

  beforeEach(() => {
    favoriteIds = [];
    getCompanions.mockReset();
    getUser.mockReset();
    toggleFavoriteCompanion.mockReset();
    importFavoriteCompanions.mockReset();
    localStorage.removeItem("stanect:lastCompanionId");
    localStorage.removeItem("stanect:favoriteCompanionIds");
    getUser.mockImplementation(async () => ({
      plan: "free",
      favorite_companion_ids: [...favoriteIds],
    }));
    toggleFavoriteCompanion.mockImplementation(async (companionId: string) => {
      const next = new Set(favoriteIds);
      if (next.has(companionId)) next.delete(companionId);
      else next.add(companionId);
      favoriteIds = [...next];
      return { favorite_companion_ids: favoriteIds };
    });
    importFavoriteCompanions.mockImplementation(async (ids: string[]) => {
      favoriteIds = [...new Set([...favoriteIds, ...ids])];
      return { favorite_companion_ids: favoriteIds };
    });
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

    expect(
      await screen.findByText(
        (_, node) => node?.textContent === "Keep going with Alex?",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Continue convo" })).toHaveAttribute(
      "href",
      "/dashboard/c2",
    );
    expect(screen.getByRole("link", { name: "Continue convo" })).toHaveClass(
      "h-8",
      "!text-sm",
    );
    expect(
      screen.getByRole("link", { name: "Continue convo" }).querySelector("svg"),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Mia" })).toBeInTheDocument();
    expect(screen.queryByText(/Welcome back/)).not.toBeInTheDocument();
    expect(screen.queryByText("Free")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Create companion" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Search companions" })).toBeInTheDocument();
  });

  it("offers Create companion on a full row when the plan still has room", async () => {
    getCompanions.mockResolvedValue([mia, alex, sam]);
    getUser.mockImplementation(async () => ({
      plan: "pro",
      favorite_companion_ids: [...favoriteIds],
    }));

    renderWithProviders(<DashboardCompanionList userId="user_test" />);

    expect(await screen.findByRole("link", { name: "Create companion" })).toHaveAttribute(
      "href",
      "/new",
    );
    expect(screen.getByRole("link", { name: "Create companion" })).toHaveClass(
      "h-10",
      "!text-sm",
      "w-full",
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
    expect(screen.getByRole("link", { name: "Create companion" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Search companions" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "All" })).toBeInTheDocument();
  });

  it("does not show search on an empty dashboard", async () => {
    getCompanions.mockResolvedValue([]);
    renderWithProviders(<DashboardCompanionList userId="user_test" />);

    expect(
      await screen.findByRole("heading", { name: "Create your first companion" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: "Search companions" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Create companion" }),
    ).not.toBeInTheDocument();
  });

  it("shows search, filter, and Create companion with a single companion", async () => {
    getCompanions.mockResolvedValue([mia]);
    renderWithProviders(<DashboardCompanionList userId="user_test" />);

    expect(await screen.findByRole("heading", { name: "Mia" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Search companions" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Favorites" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Create companion" })).toHaveAttribute(
      "href",
      "/new",
    );
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

  it("defaults to All and keeps only starred companions on Favorites", async () => {
    const user = userEvent.setup();
    getCompanions.mockResolvedValue([mia, alex]);

    renderWithProviders(<DashboardCompanionList userId="user_test" />);

    expect(await screen.findByRole("radio", { name: "All" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    const miaCard = screen.getByRole("heading", { name: "Mia" }).closest("article");
    expect(miaCard).toBeTruthy();
    await user.click(
      within(miaCard as HTMLElement).getByRole("button", { name: "Add to favorites" }),
    );
    await waitFor(() => {
      expect(toggleFavoriteCompanion).toHaveBeenCalledWith("c1");
    });
    await user.click(screen.getByRole("radio", { name: "Favorites" }));

    expect(screen.getByRole("radio", { name: "Favorites" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("heading", { name: "Mia" })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: "Alex" })).not.toBeInTheDocument();
    });
    expect(
      screen.queryByRole("link", { name: "Create another companion" }),
    ).not.toBeInTheDocument();
  });

  it("shows an empty favorites state and returns to All", async () => {
    const user = userEvent.setup();
    getCompanions.mockResolvedValue([mia, alex]);

    renderWithProviders(<DashboardCompanionList userId="user_test" />);

    await user.click(await screen.findByRole("radio", { name: "Favorites" }));

    expect(
      screen.getByRole("heading", { name: "No favorites yet" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Create your first companion" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Show all" }));
    expect(screen.getByRole("radio", { name: "All" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("heading", { name: "Mia" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Alex" })).toBeInTheDocument();
  });

  it("searches inside the current favorite set", async () => {
    const user = userEvent.setup();
    favoriteIds = ["c1", "c2"];
    getCompanions.mockResolvedValue([mia, alex]);

    renderWithProviders(<DashboardCompanionList userId="user_test" />);

    await user.click(await screen.findByRole("radio", { name: "Favorites" }));
    expect(screen.getByRole("heading", { name: "Mia" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Alex" })).toBeInTheDocument();

    await user.type(screen.getByRole("textbox", { name: "Search companions" }), "Mia");

    await waitFor(() => {
      expect(screen.getByText("1 of 2")).toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "Alex" })).not.toBeInTheDocument();
    });
    expect(screen.getByRole("heading", { name: "Mia" })).toBeInTheDocument();
  });

  it("moves All and Favorites with arrows and announces the filter", async () => {
    const user = userEvent.setup();
    getCompanions.mockResolvedValue([mia, alex]);

    renderWithProviders(<DashboardCompanionList userId="user_test" />);

    const all = await screen.findByRole("radio", { name: "All" });
    all.focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("radio", { name: "Favorites" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "Favorites" })).toHaveFocus();
    expect(screen.getByText("Showing favorites")).toBeInTheDocument();

    await user.keyboard("{Home}");
    expect(screen.getByRole("radio", { name: "All" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "All" })).toHaveFocus();
    expect(screen.getByText("Showing all")).toBeInTheDocument();
  });

  it("does not change the filter when Escape clears nothing", async () => {
    const user = userEvent.setup();
    getCompanions.mockResolvedValue([mia, alex]);

    renderWithProviders(<DashboardCompanionList userId="user_test" />);

    const search = await screen.findByRole("textbox", {
      name: "Search companions",
    });
    search.focus();
    await user.keyboard("{Escape}");

    expect(search).toHaveValue("");
    expect(screen.getByRole("radio", { name: "All" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("moves leftover local favorites onto the user", async () => {
    localStorage.setItem(
      "stanect:favoriteCompanionIds",
      JSON.stringify(["c1"]),
    );
    getCompanions.mockResolvedValue([mia, alex]);

    renderWithProviders(<DashboardCompanionList userId="user_test" />);

    expect(await screen.findByRole("heading", { name: "Mia" })).toBeInTheDocument();
    await waitFor(() => {
      expect(importFavoriteCompanions).toHaveBeenCalledWith(["c1"]);
    });
    await waitFor(() => {
      expect(localStorage.getItem("stanect:favoriteCompanionIds")).toBeNull();
    });

    const miaCard = screen.getByRole("heading", { name: "Mia" }).closest("article");
    expect(
      within(miaCard as HTMLElement).getByRole("button", {
        name: "Remove from favorites",
      }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
