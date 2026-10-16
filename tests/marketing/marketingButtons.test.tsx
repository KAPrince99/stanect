import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CompanyAbout from "@/app/(company)/company/CompanyAbout";
import FeaturesPage from "@/app/(features)/features/page";
import { NavbarPrimaryAction } from "@/app/(marketing)/components/Navbar/NavbarPrimaryAction";
import Scenario from "@/app/(marketing)/components/Scenario/Scenario";
import MarketingPricing from "@/components/ui/pricing/MarketingPricing";

vi.mock("@/components/ui/lordIcon", () => ({
  default: () => null,
}));

describe("marketing buttons", () => {
  it("the navbar action is a primary pill that follows sign-in state", () => {
    const { rerender } = render(
      <NavbarPrimaryAction isLoading={false} isSignedIn={false} onClick={vi.fn()} />,
    );

    const start = screen.getByRole("link", { name: "Start For Free" });
    expect(start).toHaveAttribute("href", "/login");
    expect(start).toHaveClass("from-brand-from", "rounded-full", "h-11");

    rerender(
      <NavbarPrimaryAction isLoading={false} isSignedIn onClick={vi.fn()} />,
    );
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/dashboard",
    );
  });

  it("the scenario Get Started is one primary link, not a link inside a button", () => {
    render(
      <Scenario
        scenario={{ id: 1, title: "Gym", message: "Say hi.", imageUrl: "" }}
      />,
    );

    const link = screen.getByRole("link", { name: "Get Started" });
    expect(link).toHaveAttribute("href", "/dashboard");
    expect(link).toHaveClass("from-brand-from", "rounded-full", "h-11");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("the features page ends with a primary and a secondary link", () => {
    render(<FeaturesPage />);

    expect(screen.getByRole("link", { name: "View plans" })).toHaveClass(
      "from-brand-from",
      "rounded-full",
      "h-11",
    );
    expect(screen.getByRole("link", { name: "Open dashboard" })).toHaveClass(
      "border-white/20",
      "rounded-full",
      "h-11",
    );
  });

  it("the company page uses the shared 48px pills instead of square hand-made links", () => {
    render(<CompanyAbout />);

    const tryIt = screen.getByRole("link", { name: /Try Stanect/ });
    expect(tryIt).toHaveClass("from-brand-from", "rounded-full", "h-12");

    const github = screen.getByRole("link", { name: "GitHub" });
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveClass("border-white/20", "rounded-full", "h-12");
  });

  it("homepage pricing sells the plans instead of managing a subscription", () => {
    render(<MarketingPricing />);

    const startFree = screen.getByRole("link", { name: "Start for free" });
    const goPro = screen.getByRole("link", { name: "Go Pro" });
    const claimThrone = screen.getByRole("link", { name: "Claim Your Throne" });

    expect(startFree).toHaveAttribute("href", "/login");
    expect(goPro).toHaveAttribute("href", "/login");
    expect(claimThrone).toHaveAttribute("href", "/login");
    expect(startFree).toHaveClass("border-white/20", "rounded-full", "h-11");
    expect(goPro).toHaveClass("from-brand-from", "rounded-full", "h-11");
    expect(claimThrone).toHaveClass("from-brand-from", "rounded-full", "h-11");
    expect(screen.queryByRole("button", { name: "Active" })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Downgrade to Free" }),
    ).not.toBeInTheDocument();
  });
});
