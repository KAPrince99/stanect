import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PillSignInButton from "@/components/ui/pill/PillSignInButton";
import TabNavigation from "@/components/ui/NewTabForm/TabNavigation";
import UpdatePlan from "@/components/ui/profileRelated/updatePlan";
import UpgradeAlert from "@/components/ui/upgradeAlert";
import { renderWithProviders } from "@/tests/support/render";

describe("profile, new-companion, and pill buttons", () => {
  it("Upgrade Plan is a primary pill link to pricing", () => {
    render(<UpdatePlan label="Change Plan" />);

    const link = screen.getByRole("link", { name: "Change Plan" });
    expect(link).toHaveAttribute("href", "/pricing");
    expect(link).toHaveClass("from-brand-from", "rounded-full", "h-11");
  });

  it("previous and next are round glass buttons", () => {
    render(
      <TabNavigation
        onPrevClick={vi.fn()}
        onNextClick={vi.fn()}
        canGoPrev
        canGoNext
      />,
    );

    for (const name of ["Go to previous tab", "Go to next tab"]) {
      expect(screen.getByRole("button", { name })).toHaveClass(
        "rounded-full",
        "bg-white/8",
        "size-11",
      );
    }
  });

  it("the limit screen offers a 48px primary upgrade link", () => {
    renderWithProviders(<UpgradeAlert plan="free" maxAllowed={1} />);

    const upgrade = screen.getByRole("link", { name: /Upgrade to Pro/ });
    expect(upgrade).toHaveClass("from-brand-from", "rounded-full", "h-12");
  });

  it("Sign In is a primary pill button", () => {
    render(<PillSignInButton />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("from-brand-from", "rounded-full", "h-11");
  });
});
