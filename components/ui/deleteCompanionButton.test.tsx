import { QueryClient } from "@tanstack/react-query";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { testMocks } from "@/test/mocks";
import { renderWithProviders } from "@/test/render";

import DeleteCompanionButton from "./deleteCompanionButton";

const { deleteCompanion } = vi.hoisted(() => ({
  deleteCompanion: vi.fn(),
}));

vi.mock("@/app/(app)/actions/actions", () => ({
  deleteCompanion,
}));

const mia = { id: "c1", companion_name: "Mia" };
const alex = { id: "c2", companion_name: "Alex" };

function seedCompanions() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });
  queryClient.setQueryData(["companions"], [mia, alex]);
  queryClient.setQueryData(["companions", "c1"], mia);
  return queryClient;
}

describe("DeleteCompanionButton", () => {
  beforeEach(() => {
    deleteCompanion.mockReset();
  });

  it("removes the companion from the list only after confirmation", async () => {
    const user = userEvent.setup();
    let resolveDelete: () => void = () => {};
    deleteCompanion.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveDelete = resolve;
      }),
    );
    const queryClient = seedCompanions();
    const invalidate = vi.spyOn(queryClient, "invalidateQueries");

    renderWithProviders(<DeleteCompanionButton id="c1" variant="ghost" />, {
      queryClient,
    });

    expect(queryClient.getQueryData(["companions"])).toEqual([mia, alex]);

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(await screen.findByText("Delete companion?")).toBeInTheDocument();
    expect(queryClient.getQueryData(["companions"])).toEqual([mia, alex]);

    await user.click(
      screen.getByRole("button", { name: "Yes, Delete Forever" }),
    );

    await waitFor(() => {
      expect(queryClient.getQueryData(["companions"])).toEqual([alex]);
    });
    expect(queryClient.getQueryData(["companions", "c1"])).toEqual(mia);
    expect(screen.getByRole("button", { name: "Deleting…" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();

    resolveDelete();

    await waitFor(() => {
      expect(testMocks.router.replace).toHaveBeenCalledWith("/dashboard");
    });
    expect(testMocks.toast.success).toHaveBeenCalledWith(
      "Companion deleted successfully",
      expect.objectContaining({
        description: "They've been removed from your world forever.",
      }),
    );
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ["companions"],
      type: "all",
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ["createCompanionGate"],
      type: "all",
    });

    const successOptions = testMocks.toast.success.mock.calls[0][1] as {
      action: { onClick: () => void };
    };
    successOptions.action.onClick();
    expect(testMocks.toast).toHaveBeenCalledWith("Undo not available yet", {
      duration: 2000,
    });
  });

  it("restores the companion when delete fails", async () => {
    const user = userEvent.setup();
    let rejectDelete: (error: Error) => void = () => {};
    deleteCompanion.mockReturnValue(
      new Promise<void>((_resolve, reject) => {
        rejectDelete = reject;
      }),
    );
    const queryClient = seedCompanions();

    renderWithProviders(<DeleteCompanionButton id="c1" variant="ghost" />, {
      queryClient,
    });

    await user.click(screen.getByRole("button", { name: "Delete" }));
    await user.click(
      await screen.findByRole("button", { name: "Yes, Delete Forever" }),
    );

    await waitFor(() => {
      expect(queryClient.getQueryData(["companions"])).toEqual([alex]);
    });

    rejectDelete(new Error("Nope"));

    await waitFor(() => {
      expect(queryClient.getQueryData(["companions"])).toEqual([mia, alex]);
    });
    expect(testMocks.toast.error).toHaveBeenCalledWith(
      "Nope",
      expect.objectContaining({ style: { background: "#ff4d4f" } }),
    );
    expect(testMocks.router.replace).not.toHaveBeenCalled();
  });
});
