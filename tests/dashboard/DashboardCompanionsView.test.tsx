import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { CompanionProps } from "@/types/types";
import { renderWithProviders } from "@/tests/support/render";

import DashboardCompanionsView from "@/components/ui/HomeDashboard/DashboardCompanionsView";
import { CREATE_LORD_ICON } from "@/components/ui/sidebar/sidebarNavConfig";

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

describe("DashboardCompanionsView", () => {
  it("announces loading", () => {
    renderWithProviders(
      <DashboardCompanionsView
        companions={[]}
        isLoading
        onStartSetup={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("status", { name: "Loading dashboard" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Create your first companion" }),
    ).not.toBeInTheDocument();
  });

  it("starts setup from the empty dashboard", async () => {
    const user = userEvent.setup();
    const onStartSetup = vi.fn();
    renderWithProviders(
      <DashboardCompanionsView
        companions={[]}
        isLoading={false}
        onStartSetup={onStartSetup}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Create your first companion" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Start Companion Setup" }));
    expect(onStartSetup).toHaveBeenCalledOnce();
  });

  it("uses the shared pill buttons: 48px setup and 44px card start", () => {
    const { unmount } = renderWithProviders(
      <DashboardCompanionsView
        companions={[]}
        isLoading={false}
        onStartSetup={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "Start Companion Setup" })).toHaveClass(
      "from-brand-from",
      "rounded-full",
      "h-12",
    );
    unmount();

    renderWithProviders(
      <DashboardCompanionsView
        companions={[mia, alex, sam]}
        isLoading={false}
        onStartSetup={vi.fn()}
      />,
    );
    for (const start of screen.getAllByRole("button", { name: "Start Convo" })) {
      expect(start).toHaveClass("from-brand-from", "rounded-full", "h-11");
    }
  });

  it("disables setup while navigation is pending", () => {
    renderWithProviders(
      <DashboardCompanionsView
        companions={[]}
        isLoading={false}
        isStartingSetup
        onStartSetup={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Start Companion Setup" })).toBeDisabled();
  });

  it("shows a thin continue row without welcome or a plan badge", () => {
    renderWithProviders(
      <DashboardCompanionsView
        companions={[mia]}
        continueCompanion={mia}
        searchQuery=""
        onSearchQueryChange={vi.fn()}
        isLoading={false}
        onStartSetup={vi.fn()}
      />,
    );

    expect(
      screen.getByText((_, node) => node?.textContent === "Keep going with Mia?"),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Mia" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Continue convo" })).toHaveAttribute(
      "href",
      "/dashboard/c1",
    );
    expect(screen.getByRole("link", { name: "Continue convo" })).toHaveClass(
      "h-8",
      "!text-sm",
    );
    expect(
      screen.getByText((_, node) => node?.textContent === "Keep going with Mia?")
        ?.parentElement,
    ).toHaveClass("pl-2", "sm:pl-3");
    expect(screen.getByRole("search")).toHaveClass("px-4", "sm:px-5");
    expect(screen.getByRole("link", { name: "Create companion" })).not.toHaveClass(
      "pl-4",
    );
    expect(
      screen.getByRole("link", { name: "Continue convo" }).querySelector("svg"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Welcome back, Ada")).not.toBeInTheDocument();
    expect(screen.queryByText("Free")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Create companion" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Search companions" })).toBeInTheDocument();
    expect(screen.getByRole("search")).toBeInTheDocument();
    expect(screen.getByRole("search").querySelector("img")).toHaveAttribute(
      "src",
      "/icons/search-magnifier.svg",
    );
    expect(screen.getByRole("search").querySelector("img")).not.toHaveClass(
      "animate-search-look",
    );
    expect(screen.getByRole("radio", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Favorites" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Create another companion" })).toHaveLength(
      2,
    );
  });

  it("puts a thin Create companion on the right when the row is full", () => {
    renderWithProviders(
      <DashboardCompanionsView
        companions={[mia, alex, sam]}
        continueCompanion={alex}
        canCreateCompanion
        isLoading={false}
        onStartSetup={vi.fn()}
      />,
    );

    expect(
      screen.getByText((_, node) => node?.textContent === "Keep going with Alex?"),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Continue convo" })).toHaveAttribute(
      "href",
      "/dashboard/c2",
    );
    expect(screen.getByRole("link", { name: "Continue convo" })).toHaveClass("h-8");
    expect(
      screen.getByRole("link", { name: "Continue convo" }).closest(".justify-between"),
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: "Create companion" })).toHaveAttribute(
      "href",
      "/new",
    );
    expect(screen.getByRole("link", { name: "Create companion" })).toHaveClass(
      "h-10",
      "!text-sm",
      "max-md:hidden",
    );
    expect(
      screen.getByRole("link", { name: "Create companion" }).querySelector("lord-icon"),
    ).toHaveAttribute("src", CREATE_LORD_ICON);
    expect(
      screen.getByRole("link", { name: "Create companion" }).querySelector("svg"),
    ).toBeNull();
    expect(screen.queryByText("Pro")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Create another companion" }),
    ).not.toBeInTheDocument();
  });

  it("hides ghost cards while searching and never uses the setup empty state", () => {
    const onSearchQueryChange = vi.fn();
    const view = renderWithProviders(
      <DashboardCompanionsView
        companions={[mia, alex]}
        filteredCompanions={[mia, alex]}
        continueCompanion={alex}
        searchQuery=""
        onSearchQueryChange={onSearchQueryChange}
        isLoading={false}
        onStartSetup={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("textbox", { name: "Search companions" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: "Create another companion" }).length,
    ).toBeGreaterThan(0);

    view.unmount();
    renderWithProviders(
      <DashboardCompanionsView
        companions={[mia, alex]}
        filteredCompanions={[]}
        continueCompanion={alex}
        searchQuery="zzz"
        activeQuery="zzz"
        onSearchQueryChange={onSearchQueryChange}
        isLoading={false}
        onStartSetup={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "No companions match “zzz”" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/of \d+/)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Create your first companion" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Create another companion" }),
    ).not.toBeInTheDocument();
  });

  it("puts All and Favorites beside search", () => {
    renderWithProviders(
      <DashboardCompanionsView
        companions={[mia, alex]}
        filteredCompanions={[mia, alex]}
        continueCompanion={alex}
        searchQuery=""
        onSearchQueryChange={vi.fn()}
        isLoading={false}
        onStartSetup={vi.fn()}
      />,
    );

    expect(screen.getByRole("radio", { name: "All" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "Favorites" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    expect(screen.getByRole("radio", { name: "All" })).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(screen.getByRole("radio", { name: "Favorites" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
    expect(screen.getByRole("radiogroup", { name: "Filter companions" })).toHaveAttribute(
      "aria-controls",
      "dashboard-companion-results",
    );
    expect(screen.getByRole("search").parentElement).toHaveClass(
      "rounded-3xl",
      "h-[3.625rem]",
    );
    expect(screen.getByRole("search").parentElement).not.toHaveClass(
      "grid-cols-subgrid",
    );
    expect(screen.getByRole("radiogroup", { name: "Filter companions" })).toHaveClass(
      "rounded-2xl",
      "border-white/20",
      "dashboard-one-card",
      "m-1.5",
    );
    expect(screen.getByRole("radiogroup", { name: "Filter companions" })).not.toHaveClass(
      "w-36",
    );
    expect(
      screen.getByRole("radiogroup", { name: "Filter companions" }).closest(
        ".dashboard-board",
      ),
    ).toBeTruthy();
    expect(screen.getByRole("radiogroup", { name: "Filter companions" })).not.toHaveClass(
      "rounded-full",
    );
    expect(screen.getByText("Showing all")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Favorites" })).toHaveAccessibleName(
      "Favorites",
    );
    expect(screen.getByText("Favs")).toBeInTheDocument();
  });

  it("moves the magnifier and brand border while search is focused", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <DashboardCompanionsView
        companions={[mia, alex]}
        filteredCompanions={[mia, alex]}
        continueCompanion={alex}
        searchQuery=""
        onSearchQueryChange={vi.fn()}
        isLoading={false}
        onStartSetup={vi.fn()}
      />,
    );

    const magnifier = screen.getByRole("search").querySelector("img");
    const capsule = screen.getByRole("search").parentElement;
    expect(magnifier).not.toHaveClass("animate-search-look");
    expect(capsule).toHaveClass("border-white/20");
    expect(capsule).not.toHaveClass("animate-search-border");

    await user.click(screen.getByRole("textbox", { name: "Search companions" }));
    expect(magnifier).toHaveClass("animate-search-look");
    expect(capsule).toHaveClass("animate-search-border", "border-white/20");
  });

  it("shows the empty favorites state without the setup wizard", () => {
    renderWithProviders(
      <DashboardCompanionsView
        companions={[mia, alex]}
        filteredCompanions={[]}
        continueCompanion={alex}
        searchQuery=""
        companionFilter="favorites"
        favoriteIds={new Set()}
        onSearchQueryChange={vi.fn()}
        onCompanionFilterChange={vi.fn()}
        isLoading={false}
        onStartSetup={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "No favorites yet" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show all" })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Create your first companion" }),
    ).not.toBeInTheDocument();
  });

  it("uses the favorites empty search copy, not the setup wizard", () => {
    renderWithProviders(
      <DashboardCompanionsView
        companions={[mia, alex]}
        filteredCompanions={[]}
        continueCompanion={alex}
        searchQuery="zzz"
        activeQuery="zzz"
        companionFilter="favorites"
        favoriteIds={new Set(["c1"])}
        onSearchQueryChange={vi.fn()}
        onCompanionFilterChange={vi.fn()}
        isLoading={false}
        onStartSetup={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "No favorites match “zzz”" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Create your first companion" }),
    ).not.toBeInTheDocument();
  });
});
