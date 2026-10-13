import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { testMocks } from "@/test/mocks";
import { renderWithProviders } from "@/test/render";

import ProfileDangerZone from "./ProfileDangerZone";

describe("ProfileDangerZone", () => {
  it("deletes the Clerk user and leaves the app", async () => {
    const user = userEvent.setup();
    let resolveDelete: () => void = () => {};
    testMocks.clerk.user.delete.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveDelete = resolve;
      }),
    );

    renderWithProviders(<ProfileDangerZone />);

    await user.click(screen.getByRole("button", { name: "Delete account" }));
    await user.click(await screen.findByRole("button", { name: "Yes, delete" }));

    expect(
      await screen.findByRole("button", { name: "Deleting…" }),
    ).toBeInTheDocument();

    resolveDelete();

    await waitFor(() => {
      expect(testMocks.toast.success).toHaveBeenCalledWith("Account deleted");
    });
    expect(testMocks.router.push).toHaveBeenCalledWith("/");
  });

  it("keeps the account when Clerk refuses the delete", async () => {
    const user = userEvent.setup();
    testMocks.clerk.user.delete.mockRejectedValue(new Error("nope"));

    renderWithProviders(<ProfileDangerZone />);

    await user.click(screen.getByRole("button", { name: "Delete account" }));
    await user.click(await screen.findByRole("button", { name: "Yes, delete" }));

    await waitFor(() => {
      expect(testMocks.toast.error).toHaveBeenCalledWith(
        "Could not delete account. Try again from Manage account.",
      );
    });
    expect(testMocks.router.push).not.toHaveBeenCalled();
    expect(
      await screen.findByRole("button", { name: "Yes, delete" }),
    ).toBeEnabled();
  });

  it("does nothing when nobody is signed in", async () => {
    const user = userEvent.setup();
    const signedInUser = testMocks.clerk.user;
    testMocks.clerk.user = null as unknown as typeof signedInUser;

    try {
      renderWithProviders(<ProfileDangerZone />);

      await user.click(screen.getByRole("button", { name: "Delete account" }));
      await user.click(await screen.findByRole("button", { name: "Yes, delete" }));

      expect(signedInUser.delete).not.toHaveBeenCalled();
      expect(testMocks.toast.success).not.toHaveBeenCalled();
      expect(testMocks.router.push).not.toHaveBeenCalled();
    } finally {
      testMocks.clerk.user = signedInUser;
    }
  });
});
