import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { installLocationStub } from "@/tests/support/location";
import { testMocks } from "@/tests/support/mocks";
import { renderWithProviders } from "@/tests/support/render";

import PaymentHandler from "@/app/(app)/payment/callback/PaymentHandler";

describe("PaymentHandler", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    installLocationStub();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    testMocks.searchParams = new URLSearchParams();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns to pricing when the callback has no reference", async () => {
    renderWithProviders(<PaymentHandler />);

    await waitFor(() => {
      expect(testMocks.toast.error).toHaveBeenCalledWith(
        "No payment reference found.",
      );
    });
    expect(testMocks.router.push).toHaveBeenCalledWith("/pricing");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("accepts trxref when reference is missing", async () => {
    testMocks.searchParams = new URLSearchParams({ trxref: "trx_1" });
    fetchMock.mockResolvedValue({
      json: async () => ({
        data: { status: "success", metadata: { plan: "king" } },
      }),
    });

    renderWithProviders(<PaymentHandler />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/paystack/verify?reference=trx_1",
      );
    });
  });

  it("opens the success status after a confirmed payment", async () => {
    testMocks.searchParams = new URLSearchParams({ reference: "ref_1" });
    fetchMock.mockResolvedValue({
      json: async () => ({
        data: { status: "success", metadata: { plan: "pro" } },
      }),
    });

    renderWithProviders(<PaymentHandler />);

    await waitFor(() => {
      expect(testMocks.toast.success).toHaveBeenCalledWith(
        "Payment confirmed!",
      );
    });
    expect(testMocks.router.push).toHaveBeenCalledWith(
      "/payment/status?status=success&plan=pro",
    );
  });

  it("opens the failed status when Paystack declines the payment", async () => {
    testMocks.searchParams = new URLSearchParams({ reference: "ref_2" });
    fetchMock.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ data: { status: "failed" } }),
    });

    renderWithProviders(<PaymentHandler />);

    await waitFor(() => {
      expect(testMocks.router.push).toHaveBeenCalledWith(
        "/payment/status?status=failed",
      );
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("opens the pending status when Paystack is still confirming", async () => {
    testMocks.searchParams = new URLSearchParams({ reference: "ref_pending" });
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: { status: "pending" } }),
    });

    renderWithProviders(<PaymentHandler />);

    await waitFor(() => {
      expect(testMocks.router.push).toHaveBeenCalledWith(
        "/payment/status?status=pending",
      );
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("retries a dropped verification and then confirms the payment", async () => {
    testMocks.searchParams = new URLSearchParams({ reference: "ref_retry" });
    fetchMock
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          data: { status: "success", metadata: { plan: "pro" } },
        }),
      });

    renderWithProviders(<PaymentHandler />);

    await waitFor(() => {
      expect(testMocks.router.push).toHaveBeenCalledWith(
        "/payment/status?status=success&plan=pro",
      );
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("asks to check again when verification stays unreachable", async () => {
    const user = userEvent.setup();
    testMocks.searchParams = new URLSearchParams({ reference: "ref_3" });
    fetchMock.mockRejectedValue(new Error("offline"));

    renderWithProviders(<PaymentHandler />);

    expect(
      await screen.findByRole(
        "heading",
        { name: "We couldn't confirm this payment" },
        { timeout: 4000 },
      ),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(testMocks.router.push).not.toHaveBeenCalled();
    expect(screen.getByRole("link", { name: "Back to pricing" })).toHaveAttribute(
      "href",
      "/pricing",
    );

    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        data: { status: "success", metadata: { plan: "king" } },
      }),
    });

    await user.click(screen.getByRole("button", { name: "Check again" }));

    await waitFor(() => {
      expect(testMocks.router.push).toHaveBeenCalledWith(
        "/payment/status?status=success&plan=king",
      );
    });
  });

  it("verifies a payment only once when the effect runs twice", async () => {
    testMocks.searchParams = new URLSearchParams({ reference: "ref_4" });
    fetchMock.mockResolvedValue({
      json: async () => ({
        data: { status: "success", metadata: { plan: "pro" } },
      }),
    });

    renderWithProviders(
      <StrictMode>
        <PaymentHandler />
      </StrictMode>,
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });
});
