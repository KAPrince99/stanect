import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ErrorView from "@/components/payments/ErrorView";
import SuccessView from "@/components/payments/SuccessView";

describe("SuccessView", () => {
  it("names the plan and offers a primary link to the dashboard", () => {
    render(<SuccessView planName="Pro" />);

    expect(screen.getByText("Payment successful")).toBeInTheDocument();
    expect(screen.getByText("Pro")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "Go to Dashboard" });
    expect(link).toHaveAttribute("href", "/dashboard");
    expect(link).toHaveClass("from-brand-from", "rounded-full", "h-11");
  });
});

describe("ErrorView", () => {
  it("shows the message with a primary retry and a quiet dashboard link", () => {
    render(<ErrorView message="Transaction declined." />);

    expect(screen.getByText("Transaction declined.")).toBeInTheDocument();

    const retry = screen.getByRole("link", { name: "Try Again" });
    expect(retry).toHaveAttribute("href", "/pricing");
    expect(retry).toHaveClass("from-brand-from", "rounded-full", "h-11");

    const dashboard = screen.getByRole("link", { name: "Dashboard" });
    expect(dashboard).toHaveAttribute("href", "/dashboard");
    expect(dashboard).toHaveClass("border-white/20", "rounded-full", "h-11");
  });

  it("falls back to a generic message", () => {
    render(<ErrorView />);

    expect(
      screen.getByText(/We couldn't process your transaction/),
    ).toBeInTheDocument();
  });
});
