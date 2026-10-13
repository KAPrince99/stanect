import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { installLocationStub } from "@/test/location";
import { testMocks } from "@/test/mocks";
import { renderWithProviders } from "@/test/render";

import PricingPage from "./PricingPage";

const { fetchSubscriptionStatus } = vi.hoisted(() => ({
  fetchSubscriptionStatus: vi.fn(),
}));

vi.mock("@/app/(app)/actions/subs", () => ({
  fetchSubscriptionStatus,
}));

function jsonResponse(body: unknown, ok = true) {
  return {
    ok,
    json: async () => body,
  };
}

describe("PricingPage", () => {
  const fetchMock = vi.fn();
  let location: { href: string };

  beforeEach(() => {
    location = installLocationStub();
    fetchMock.mockReset();
    fetchSubscriptionStatus.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    testMocks.clerk.isLoaded = true;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("waits for Clerk before showing plans", () => {
    testMocks.clerk.isLoaded = false;
    fetchSubscriptionStatus.mockReturnValue(new Promise(() => {}));

    const { container } = renderWithProviders(<PricingPage />);

    expect(
      screen.queryByRole("heading", { name: "Choose your plan" }),
    ).not.toBeInTheDocument();
    expect(container.querySelector(".animate-spin")).toBeTruthy();
  });

  it("waits for the current subscription before showing plans", () => {
    fetchSubscriptionStatus.mockReturnValue(new Promise(() => {}));

    const { container } = renderWithProviders(<PricingPage />);

    expect(
      screen.queryByRole("heading", { name: "Choose your plan" }),
    ).not.toBeInTheDocument();
    expect(container.querySelector(".animate-spin")).toBeTruthy();
  });

  it("asks a paid account to confirm before downgrading to free", async () => {
    const user = userEvent.setup();
    fetchSubscriptionStatus.mockResolvedValue({ plan: "pro" });

    renderWithProviders(<PricingPage />);

    await user.click(
      await screen.findByRole("button", { name: "Downgrade to Free" }),
    );

    expect(await screen.findByText("Are you sure?")).toBeInTheDocument();
    expect(testMocks.router.push).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("leaves an already-free account on the pricing page", async () => {
    fetchSubscriptionStatus.mockResolvedValue({ plan: "free" });

    renderWithProviders(<PricingPage />);

    const active = await screen.findByRole("button", { name: "Active" });
    expect(active).toBeDisabled();
    expect(testMocks.router.push).not.toHaveBeenCalled();
  });

  it("treats a missing plan as Free", async () => {
    fetchSubscriptionStatus.mockResolvedValue({ plan: null });

    renderWithProviders(<PricingPage />);

    expect(await screen.findByRole("button", { name: "Active" })).toBeDisabled();
    expect(
      screen.queryByRole("button", { name: "Downgrade to Free" }),
    ).not.toBeInTheDocument();
    expect(testMocks.router.push).not.toHaveBeenCalled();
  });

  it("shows the monthly Pro price and only then starts checkout", async () => {
    const user = userEvent.setup();
    fetchSubscriptionStatus.mockResolvedValue({ plan: "free" });
    fetchMock.mockResolvedValue(
      jsonResponse({ authorization_url: "https://paystack.example/pro" }),
    );

    renderWithProviders(<PricingPage />);

    await user.click(await screen.findByRole("button", { name: "Go Pro" }));

    expect(
      await screen.findByText("Currency conversion notice"),
    ).toBeInTheDocument();
    expect(screen.getByText("$9/month")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();

    await user.click(
      screen.getByRole("button", { name: "Continue to payment" }),
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/paystack/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro", interval: "monthly" }),
      });
    });
    expect(location.href).toBe("https://paystack.example/pro");
  });

  it("sends the yearly interval after the yearly price is confirmed", async () => {
    const user = userEvent.setup();
    fetchSubscriptionStatus.mockResolvedValue({ plan: "free" });
    fetchMock.mockResolvedValue(
      jsonResponse({ authorization_url: "https://paystack.example/year" }),
    );

    renderWithProviders(<PricingPage />);

    await user.click(await screen.findByRole("button", { name: "yearly" }));
    await user.click(screen.getByRole("button", { name: "Go Pro" }));

    expect(await screen.findByText("$90/year")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Continue to payment" }),
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/paystack/subscribe",
        expect.objectContaining({
          body: JSON.stringify({ plan: "pro", interval: "yearly" }),
        }),
      );
    });
  });

  it("shows the King price before checkout", async () => {
    const user = userEvent.setup();
    fetchSubscriptionStatus.mockResolvedValue({ plan: "free" });

    renderWithProviders(<PricingPage />);

    await user.click(
      await screen.findByRole("button", { name: "Claim Your Throne" }),
    );

    expect(await screen.findByText("$49/month")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("stays on the page when checkout cannot start", async () => {
    const user = userEvent.setup();
    fetchSubscriptionStatus.mockResolvedValue({ plan: "free" });
    fetchMock.mockResolvedValue(jsonResponse({}, false));

    renderWithProviders(<PricingPage />);

    await user.click(await screen.findByRole("button", { name: "Go Pro" }));
    await user.click(
      await screen.findByRole("button", { name: "Continue to payment" }),
    );

    await waitFor(() => {
      expect(testMocks.toast.error).toHaveBeenCalledWith("Connection failed");
    });
    expect(location.href).toBe("http://localhost/");
    expect(screen.getByRole("button", { name: "Go Pro" })).toBeEnabled();
  });

  it("cancels a paid subscription and refreshes the plan", async () => {
    const user = userEvent.setup();
    fetchSubscriptionStatus.mockResolvedValue({ plan: "pro" });
    fetchMock.mockResolvedValue(jsonResponse({}));

    renderWithProviders(<PricingPage />);

    await user.click(
      await screen.findByRole("button", { name: "Downgrade to Free" }),
    );
    await user.click(
      await screen.findByRole("button", { name: "Yes, Downgrade" }),
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/paystack/cancel", {
        method: "POST",
      });
    });
    expect(testMocks.toast.success).toHaveBeenCalledWith(
      "Subscription Cancelled",
      { description: "You are now on the Free plan." },
    );
    expect(fetchSubscriptionStatus).toHaveBeenCalledTimes(2);
    expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
  });

  it("closes the downgrade dialog when cancellation fails", async () => {
    const user = userEvent.setup();
    fetchSubscriptionStatus.mockResolvedValue({ plan: "king" });
    fetchMock.mockResolvedValue(jsonResponse({}, false));

    renderWithProviders(<PricingPage />);

    await user.click(
      await screen.findByRole("button", { name: "Downgrade to Free" }),
    );
    await user.click(
      await screen.findByRole("button", { name: "Yes, Downgrade" }),
    );

    await waitFor(() => {
      expect(testMocks.toast.error).toHaveBeenCalledWith("Error", {
        description: "Could not process cancellation.",
      });
    });
    expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
  });
});
