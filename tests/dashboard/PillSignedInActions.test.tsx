import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PillSignedInActions from "@/components/ui/pill/PillSignedInActions";
import { renderWithProviders } from "@/tests/support/render";

describe("PillSignedInActions", () => {
  it("puts Sign out in the nav instead of the green status dot", () => {
    const { container } = renderWithProviders(<PillSignedInActions />);

    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toHaveClass("hidden", "md:inline");
    expect(container.querySelector(".h-4.w-4.bg-emerald-400")).toBeNull();
  });
});
