import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { CompanionProps } from "@/types/types";
import { renderWithProviders } from "@/tests/support/render";

import DashboardCompanionsView from "@/components/ui/HomeDashboard/DashboardCompanionsView";

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
    expect(screen.getByRole("link", { name: "Continue" })).toHaveAttribute(
      "href",
      "/dashboard/c1",
    );
    expect(screen.getByRole("link", { name: "Continue" })).toHaveClass(
      "h-8",
      "!text-sm",
    );
    expect(
      screen.getByRole("link", { name: "Continue" }).querySelector("svg"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Welcome back, Ada")).not.toBeInTheDocument();
    expect(screen.queryByText("Free")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Create companion" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Search companions" })).toBeInTheDocument();
    expect(screen.getByRole("search")).toHaveClass("col-span-2");
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
    expect(screen.getByRole("link", { name: "Continue" })).toHaveAttribute(
      "href",
      "/dashboard/c2",
    );
    expect(screen.getByRole("link", { name: "Continue" })).toHaveClass("h-8");
    expect(screen.getByRole("link", { name: "Create companion" })).toHaveAttribute(
      "href",
      "/new",
    );
    expect(screen.getByRole("link", { name: "Create companion" })).toHaveClass(
      "h-8",
      "!text-sm",
      "w-full",
    );
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
    expect(screen.getByText("0 of 2")).toBeInTheDocument();
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
});
