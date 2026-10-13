import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { installLocationStub } from "@/test/location";
import { testMocks } from "@/test/mocks";
import { renderWithProviders } from "@/test/render";

import ProfileBillingSection from "./ProfileBillingSection";

function jsonResponse(body: unknown, ok = true) {
  return {
    ok,
    json: async () => body,
  };
}

describe("ProfileBillingSection", () => {
  const fetchMock = vi.fn();
  let location: { href: string };

  beforeEach(() => {
    location = installLocationStub();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("opens the Paystack billing portal", async () => {
    const user = userEvent.setup();
    let resolveFetch: (value: unknown) => void = () => {};
    fetchMock.mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve;
      }),
    );

    renderWithProviders(<ProfileBillingSection userId="user_42" />);

    await user.click(screen.getByRole("button", { name: "Manage billing" }));

    expect(screen.getByRole("button", { name: "Opening…" })).toBeDisabled();
    expect(fetchMock).toHaveBeenCalledWith("/api/paystack/portal", {
      method: "POST",
    });

    resolveFetch(
      jsonResponse({ url: "https://paystack.example/portal" }),
    );

    await waitFor(() => {
      expect(location.href).toBe("https://paystack.example/portal");
    });
  });

  it("returns the billing button when the portal cannot be opened", async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue(jsonResponse({ error: "Portal down" }, false));

    renderWithProviders(<ProfileBillingSection userId="user_42" />);

    await user.click(screen.getByRole("button", { name: "Manage billing" }));

    await waitFor(() => {
      expect(testMocks.toast.error).toHaveBeenCalledWith("Portal down");
    });
    expect(screen.getByRole("button", { name: "Manage billing" })).toBeEnabled();
  });

  it("cancels the subscription and refreshes that user's billing data", async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue(jsonResponse({}));
    const { queryClient } = renderWithProviders(
      <ProfileBillingSection userId="user_42" />,
    );
    const invalidate = vi.spyOn(queryClient, "invalidateQueries");

    await user.click(screen.getByRole("button", { name: "Cancel subscription" }));
    expect(await screen.findByText("Are you sure?")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Yes, Downgrade" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/paystack/cancel", {
        method: "POST",
      });
    });
    expect(testMocks.toast.success).toHaveBeenCalledWith(
      "Subscription cancelled",
      { description: "You are now on the Free plan." },
    );
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ["subscription", "user_42"],
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ["users", "user_42"],
    });
    expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
  });

  it("closes the dialog and leaves billing usable when cancellation fails", async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue(jsonResponse({}, false));

    renderWithProviders(<ProfileBillingSection userId="user_42" />);

    await user.click(screen.getByRole("button", { name: "Cancel subscription" }));
    await user.click(
      await screen.findByRole("button", { name: "Yes, Downgrade" }),
    );

    await waitFor(() => {
      expect(testMocks.toast.error).toHaveBeenCalledWith(
        "Could not process cancellation.",
      );
    });
    expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Manage billing" })).toBeEnabled();
    expect(
      screen.getByRole("button", { name: "Cancel subscription" }),
    ).toBeEnabled();
  });
});
