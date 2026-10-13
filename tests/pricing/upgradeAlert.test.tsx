import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/tests/support/render";

import UpgradeAlert from "@/components/ui/upgradeAlert";

describe("UpgradeAlert", () => {
  it("names the plan and companion cap and links to pricing and the dashboard", () => {
    renderWithProviders(<UpgradeAlert plan="free" maxAllowed={1} />);

    expect(
      screen.getByRole("heading", { name: "Limit reached" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Your FREE plan allows for 1 companion. You've already brought one to life!",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Upgrade to Pro/ })).toHaveAttribute(
      "href",
      "/pricing",
    );
    expect(
      screen.getByRole("link", { name: /Back to Dashboard/ }),
    ).toHaveAttribute("href", "/dashboard");
  });
});
