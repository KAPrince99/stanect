import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/tests/support/render";

import ConvoGuard from "@/components/ui/convoGuard";

describe("ConvoGuard", () => {
  it("offers an upgrade when the trial has ended", () => {
    renderWithProviders(<ConvoGuard reason="trial_expired" />);

    expect(
      screen.getByRole("heading", { name: "Trial period ended" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Your 7-day exploration of Stanect has finished. Upgrade to Pro to keep practicing.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Upgrade to Pro/ })).toHaveAttribute(
      "href",
      "/pricing",
    );
    expect(
      screen.getByRole("link", { name: "Back to Dashboard" }),
    ).toHaveAttribute("href", "/dashboard");
    expect(screen.queryByRole("button", { name: /Try again/ })).not.toBeInTheDocument();
  });

  it("offers an upgrade when the daily credit is spent", () => {
    renderWithProviders(<ConvoGuard reason="daily_limit_reached" />);

    expect(
      screen.getByRole("heading", { name: "Daily limit reached" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "You've used your free daily talk credit. It resets at midnight",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Upgrade to Pro/ })).toHaveAttribute(
      "href",
      "/pricing",
    );
  });

  it("retries a failed access check", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    renderWithProviders(
      <ConvoGuard reason="check_failed" onRetry={onRetry} />,
    );

    expect(
      screen.getByRole("heading", { name: "Couldn't verify access" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Try again/ }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("disables retry while a check is in flight", () => {
    renderWithProviders(
      <ConvoGuard reason="check_failed" onRetry={vi.fn()} isRetrying />,
    );

    expect(screen.getByRole("button", { name: /Checking/ })).toBeDisabled();
  });

  it("offers an upgrade when a failed check has no retry handler", () => {
    renderWithProviders(<ConvoGuard reason="check_failed" />);

    expect(screen.getByRole("link", { name: /Upgrade to Pro/ })).toHaveAttribute(
      "href",
      "/pricing",
    );
  });
});
