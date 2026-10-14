import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AppRouteLoading, {
  DashboardRouteLoading,
  NewCompanionRouteLoading,
  PricingRouteLoading,
  ProfileRouteLoading,
} from "@/components/ui/AppRouteLoading";
import {
  PaymentCallbackSkeleton,
  PaymentStatusSkeleton,
  PricingSuccessSkeleton,
} from "@/components/payments/PaymentSkeleton";
import { AuthRouteLoading } from "@/components/ui/auth/AuthSkeleton";
import { ConvoRouteLoading } from "@/components/ui/convo/ConvoSkeleton";
import { AvatarSkeleton } from "@/components/ui/NewTabForm/AvatarSkeleton";
import { PreviewSkeleton } from "@/components/ui/NewTabForm/PreviewSkeleton";

describe("route skeletons copy the live layouts", () => {
  it("renders the profile as identity, info rows, three stats, and billing", () => {
    const { container } = render(<ProfileRouteLoading />);

    expect(
      screen.getByRole("status", { name: "Loading profile" }),
    ).toBeInTheDocument();
    expect(container.querySelector(".animate-spin")).toBeNull();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(container.querySelectorAll("article")).toHaveLength(3);
    expect(
      container.querySelectorAll('[class*="grid-cols-[50px_3fr]"]').length,
    ).toBe(4);
  });

  it("renders pricing as a billing switch and three tier cards", () => {
    const { container } = render(<PricingRouteLoading />);

    expect(
      screen.getByRole("status", { name: "Loading pricing" }),
    ).toBeInTheDocument();
    expect(container.querySelector(".animate-spin")).toBeNull();
    expect(
      screen.queryByRole("heading", { name: "Choose your plan" }),
    ).not.toBeInTheDocument();
    expect(container.querySelectorAll("ul")).toHaveLength(3);
    expect(container.querySelectorAll("li")).toHaveLength(18);
  });

  it("renders companion setup as tabs, the avatar grid, and nav pills", () => {
    const { container } = render(<NewCompanionRouteLoading />);

    expect(
      screen.getByRole("status", { name: "Loading companion setup" }),
    ).toBeInTheDocument();
    expect(container.querySelector(".animate-spin")).toBeNull();
    expect(
      screen.queryByRole("heading", { name: "Choose Your Muse" }),
    ).not.toBeInTheDocument();
    expect(container.querySelectorAll(".aspect-square")).toHaveLength(8);
    expect(container.querySelectorAll(".size-11.rounded-full")).toHaveLength(2);
  });

  it("keeps dashboard cards on the live portrait and 44px start pill", () => {
    const { container } = render(<DashboardRouteLoading />);

    expect(
      screen.getByRole("status", { name: "Loading dashboard" }),
    ).toBeInTheDocument();
    expect(container.querySelector(".h-8.w-24.rounded-full")).toBeTruthy();
    expect(container.querySelector(".h-10.w-full")).toBeTruthy();
    expect(
      container.querySelector('[data-skeleton="dashboard-search"]'),
    ).toBeTruthy();
    expect(
      container.querySelector('[data-skeleton="dashboard-filter"]'),
    ).toBeTruthy();
    expect(container.querySelector(".h-11.w-full.rounded-full")).toBeTruthy();
    expect(container.querySelector('[class*="aspect-4/5"]')).toBeTruthy();
  });

  it("renders the conversation as the idle ready stage", () => {
    const { container } = render(<ConvoRouteLoading />);

    expect(
      screen.getByRole("status", { name: "Loading conversation" }),
    ).toBeInTheDocument();
    expect(container.querySelector(".animate-spin")).toBeNull();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(container.querySelector("aside")).toBeTruthy();
    expect(container.querySelector(".h-11.sm\\:w-48")).toBeTruthy();
    expect(container.querySelector('[class*="w-[220px]"]')).toBeTruthy();
  });

  it("renders auth as the two-column card with a Clerk form ghost", () => {
    const { container } = render(<AuthRouteLoading mode="login" />);

    expect(
      screen.getByRole("status", { name: "Loading sign in" }),
    ).toBeInTheDocument();
    expect(container.querySelector(".animate-spin")).toBeNull();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(container.querySelector("aside")).toBeTruthy();
    expect(container.querySelector('[class*="max-w-[400px]"]')).toBeTruthy();
    expect(
      container.querySelectorAll(".h-10.w-full.rounded-xl").length,
    ).toBeGreaterThanOrEqual(2);
  });

  it("renders the callback wait as the verifying stack", () => {
    const { container } = render(<PaymentCallbackSkeleton />);

    expect(
      screen.getByRole("status", { name: "Verifying payment" }),
    ).toBeInTheDocument();
    expect(container.querySelector(".animate-spin")).toBeNull();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(container.querySelector(".h-16.w-16")).toBeTruthy();
  });

  it("renders payment status as the confirming card", () => {
    const { container } = render(<PaymentStatusSkeleton />);

    expect(
      screen.getByRole("status", { name: "Loading payment status" }),
    ).toBeInTheDocument();
    expect(container.querySelector(".animate-spin")).toBeNull();
    expect(container.querySelector(".rounded-3xl")).toBeTruthy();
    expect(
      container.querySelector(".h-12.w-full.rounded-full"),
    ).toBeTruthy();
  });

  it("renders pricing success as the unlocked-plan card", () => {
    const { container } = render(<PricingSuccessSkeleton />);

    expect(
      screen.getByRole("status", { name: "Loading plan unlock" }),
    ).toBeInTheDocument();
    expect(container.querySelector(".animate-spin")).toBeNull();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(container.querySelector(".h-11.w-full.rounded-full")).toBeTruthy();
  });

  it("announces sign-up separately from sign-in", () => {
    render(<AuthRouteLoading mode="signup" />);

    expect(
      screen.getByRole("status", { name: "Loading sign up" }),
    ).toBeInTheDocument();
  });

  it("renders the generic app fallback as a column card, not a spinner", () => {
    const { container } = render(<AppRouteLoading />);

    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
    expect(container.querySelector(".animate-spin")).toBeNull();
    expect(container.querySelector(".rounded-3xl")).toBeTruthy();
    expect(container.querySelector(".h-11.w-36.rounded-full")).toBeTruthy();
  });

  it("announces the avatar step skeleton on its own", () => {
    render(<AvatarSkeleton />);

    expect(
      screen.getByRole("status", { name: "Loading avatars" }),
    ).toBeInTheDocument();
  });

  it("announces the preview step skeleton on its own", () => {
    render(<PreviewSkeleton />);

    expect(
      screen.getByRole("status", { name: "Loading preview" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Review companion" }),
    ).not.toBeInTheDocument();
  });
});
