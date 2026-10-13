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
        welcomeUser="Ada"
        continueCompanion={null}
        canCreateCompanion
        planBadgeLabel="Free"
        planBadgeTone="ok"
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
        welcomeUser="Ada"
        continueCompanion={null}
        canCreateCompanion
        planBadgeLabel="Free"
        planBadgeTone="ok"
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

  it("uses the shared pill buttons: 48px setup, 44px continue and create, 44px card start", () => {
    const { unmount } = renderWithProviders(
      <DashboardCompanionsView
        companions={[]}
        welcomeUser="Ada"
        continueCompanion={null}
        canCreateCompanion
        planBadgeLabel="Free"
        planBadgeTone="ok"
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
        welcomeUser="Ada"
        continueCompanion={alex}
        canCreateCompanion
        planBadgeLabel="Pro"
        planBadgeTone="paid"
        isLoading={false}
        onStartSetup={vi.fn()}
      />,
    );
    for (const link of screen.getAllByRole("link", { name: "Continue" })) {
      expect(link).toHaveClass("from-brand-from", "rounded-full", "h-11");
    }
    expect(screen.getByRole("link", { name: "Create companion" })).toHaveClass(
      "rounded-full",
      "h-11",
      "border-white/20",
    );
    for (const start of screen.getAllByRole("button", { name: "Start Convo" })) {
      expect(start).toHaveClass("from-brand-from", "rounded-full", "h-11");
    }
  });

  it("disables setup while navigation is pending", () => {
    renderWithProviders(
      <DashboardCompanionsView
        companions={[]}
        welcomeUser="Ada"
        continueCompanion={null}
        canCreateCompanion
        planBadgeLabel="Free"
        planBadgeTone="ok"
        isLoading={false}
        isStartingSetup
        onStartSetup={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Start Companion Setup" })).toBeDisabled();
  });

  it("continues the chosen companion and shows the plan badge", () => {
    renderWithProviders(
      <DashboardCompanionsView
        companions={[mia]}
        welcomeUser="Ada"
        continueCompanion={mia}
        canCreateCompanion={false}
        planBadgeLabel="Free"
        planBadgeTone="ok"
        isLoading={false}
        onStartSetup={vi.fn()}
      />,
    );

    expect(screen.getByText("Welcome back, Ada")).toBeInTheDocument();
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Continue" })).toHaveAttribute(
      "href",
      "/dashboard/c1",
    );
    expect(screen.getAllByRole("link", { name: "Create another companion" })).toHaveLength(2);
    expect(
      screen.queryByRole("link", { name: "Create companion" }),
    ).not.toBeInTheDocument();
  });

  it("shows Create companion once three companions still fit the plan", () => {
    renderWithProviders(
      <DashboardCompanionsView
        companions={[mia, alex, sam]}
        welcomeUser="Ada"
        continueCompanion={alex}
        canCreateCompanion
        planBadgeLabel="Pro"
        planBadgeTone="paid"
        isLoading={false}
        onStartSetup={vi.fn()}
      />,
    );

    expect(screen.getByText("Pro")).toBeInTheDocument();
    for (const link of screen.getAllByRole("link", { name: "Continue" })) {
      expect(link).toHaveAttribute("href", "/dashboard/c2");
    }
    expect(screen.getByRole("link", { name: "Create companion" })).toHaveAttribute(
      "href",
      "/new",
    );
    expect(
      screen.queryByRole("link", { name: "Create another companion" }),
    ).not.toBeInTheDocument();
  });
});
