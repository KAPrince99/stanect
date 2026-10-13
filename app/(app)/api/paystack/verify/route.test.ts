import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { axiosGet, updateEq, from } = vi.hoisted(() => {
  const updateEq = vi.fn().mockResolvedValue({ error: null });
  const from = vi.fn(() => ({
    update: vi.fn(() => ({ eq: updateEq })),
  }));
  return { axiosGet: vi.fn(), updateEq, from };
});

vi.mock("axios", () => ({
  default: {
    get: axiosGet,
    isAxiosError: (error: unknown) =>
      Boolean(
        error &&
          typeof error === "object" &&
          "isAxiosError" in error &&
          (error as { isAxiosError?: boolean }).isAxiosError,
      ),
  },
}));

vi.mock("@/lib/supa-service", () => ({
  supabase: { from },
}));

import { GET } from "./route";

function request(reference = "ref_1") {
  return new NextRequest(
    `http://localhost/api/paystack/verify?reference=${reference}`,
  );
}

describe("paystack verify route", () => {
  beforeEach(() => {
    axiosGet.mockReset();
    from.mockClear();
    updateEq.mockClear();
  });

  it("activates the plan when Paystack reports success", async () => {
    axiosGet.mockResolvedValue({
      data: {
        data: {
          status: "success",
          metadata: { clerk_user_id: "user_1", plan: "pro" },
          customer: {},
        },
      },
    });

    const response = await GET(request());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.status).toBe("success");
    expect(from).toHaveBeenCalledWith("users");
    expect(updateEq).toHaveBeenCalledWith("clerk_user_id", "user_1");
  });

  it("does not activate a success Paystack cannot attach to a user", async () => {
    axiosGet.mockResolvedValue({
      data: {
        data: {
          status: "success",
          metadata: {},
          customer: {},
        },
      },
    });

    const response = await GET(request());

    expect(response.status).toBe(200);
    expect((await response.json()).data.status).toBe("failed");
    expect(from).not.toHaveBeenCalled();
  });

  it("returns pending when Paystack is still processing", async () => {
    axiosGet.mockResolvedValue({
      data: {
        data: {
          status: "ongoing",
          metadata: {},
          customer: {},
        },
      },
    });

    const response = await GET(request());

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      data: { status: "pending", metadata: {} },
    });
    expect(from).not.toHaveBeenCalled();
  });

  it("returns failed when Paystack declines the charge", async () => {
    axiosGet.mockResolvedValue({
      data: {
        data: {
          status: "abandoned",
          metadata: { plan: "pro" },
          customer: {},
        },
      },
    });

    const response = await GET(request());

    expect(response.status).toBe(200);
    expect((await response.json()).data.status).toBe("failed");
    expect(from).not.toHaveBeenCalled();
  });

  it("returns 503 when Paystack cannot be reached", async () => {
    axiosGet.mockRejectedValue(
      Object.assign(new Error("network"), { isAxiosError: true }),
    );

    const response = await GET(request());

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: "Verification failed" });
  });
});
