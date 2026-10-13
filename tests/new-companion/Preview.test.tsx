import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { testMocks } from "@/tests/support/mocks";
import { renderWithProviders } from "@/tests/support/render";
import { resetTabFormStore } from "@/tests/support/tabForm";
import { useTabFormStore } from "@/store/useTabFormStore";

import Preview from "@/components/ui/NewTabForm/Preview";

const { getSingleAvatar, createCompanion } = vi.hoisted(() => ({
  getSingleAvatar: vi.fn(),
  createCompanion: vi.fn(),
}));

vi.mock("@/app/(app)/actions/actions", () => ({
  getSingleAvatar,
  createCompanion,
}));

const mia = { id: "a1", name: "Mia", image_url: "/mia.png" };

function seedCompanion(
  overrides: Partial<ReturnType<typeof useTabFormStore.getState>> = {},
) {
  useTabFormStore.setState({
    selectedAvatarId: "a1",
    companionName: "  Mia  ",
    scene: "  Gym  ",
    voice: "female",
    sessionLength: 2,
    userPlan: "free",
    ...overrides,
  });
}

describe("Preview", () => {
  beforeEach(() => {
    resetTabFormStore();
    getSingleAvatar.mockReset();
    createCompanion.mockReset();
    getSingleAvatar.mockResolvedValue(mia);
  });

  afterEach(() => {
    resetTabFormStore();
  });

  it("shows the review once the selected avatar loads", async () => {
    let resolveAvatar: (value: typeof mia) => void = () => {};
    getSingleAvatar.mockReturnValue(
      new Promise((resolve) => {
        resolveAvatar = resolve;
      }),
    );
    seedCompanion();

    renderWithProviders(<Preview />);

    expect(
      screen.getByRole("status", { name: "Loading preview" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Review companion" }),
    ).not.toBeInTheDocument();

    resolveAvatar(mia);

    expect(
      await screen.findByRole("heading", { name: "Review companion" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Mia").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Gym").length).toBeGreaterThan(0);
    expect(screen.getAllByText("2 min").length).toBeGreaterThan(0);
  });

  it("shows an error when the avatar cannot be loaded", async () => {
    getSingleAvatar.mockRejectedValue(new Error("unavailable"));
    seedCompanion();

    renderWithProviders(<Preview />);

    expect(await screen.findByText("Unable to load preview.")).toBeInTheDocument();
  });

  it("shows an empty preview when no avatar is available", async () => {
    getSingleAvatar.mockResolvedValue(null);
    seedCompanion({ selectedAvatarId: null });

    renderWithProviders(<Preview />);

    expect(
      await screen.findByText("No avatar available for preview."),
    ).toBeInTheDocument();
  });

  it("keeps create disabled until the schema passes", async () => {
    seedCompanion({ companionName: "A" });

    renderWithProviders(<Preview />);

    expect(
      await screen.findByText("A few details still need attention:"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Name must be at least 2 characters"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Companion" }),
    ).toBeDisabled();
    expect(createCompanion).not.toHaveBeenCalled();
  });

  it("creates the companion and opens it on the dashboard", async () => {
    const user = userEvent.setup();
    const onEditStep = vi.fn();
    let resolveCreate: (value: { data: { id: string } }) => void = () => {};
    createCompanion.mockReturnValue(
      new Promise((resolve) => {
        resolveCreate = resolve;
      }),
    );
    seedCompanion();

    const { unmount, queryClient } = renderWithProviders(
      <Preview onEditStep={onEditStep} />,
    );
    const invalidate = vi.spyOn(queryClient, "invalidateQueries");

    await user.click(
      await screen.findByRole("button", { name: "Create Companion" }),
    );

    expect(
      screen.getByRole("button", { name: "Create Companion" }),
    ).toBeDisabled();
    expect(createCompanion).toHaveBeenCalledWith({
      avatar_id: "a1",
      companion_name: "Mia",
      scene: "Gym",
      voice: "female",
      duration: "2",
    });

    resolveCreate({ data: { id: "c1" } });

    await waitFor(() => {
      expect(testMocks.toast.success).toHaveBeenCalledWith(
        "Companion created successfully",
      );
    });
    expect(testMocks.router.replace).toHaveBeenCalledWith("/dashboard/c1");
    expect(localStorage.getItem("stanect:lastCompanionId")).toBe("c1");

    await user.click(screen.getAllByRole("button", { name: "Edit" })[0]);
    expect(onEditStep).not.toHaveBeenCalled();

    unmount();

    expect(useTabFormStore.getState().companionName).toBe("");
    expect(useTabFormStore.getState().selectedAvatarId).toBeNull();
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["companions"] });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ["createCompanionGate"],
    });
  });

  it("returns to the dashboard when the created companion has no id", async () => {
    const user = userEvent.setup();
    createCompanion.mockResolvedValue({ data: {} });
    seedCompanion();

    renderWithProviders(<Preview />);

    await user.click(
      await screen.findByRole("button", { name: "Create Companion" }),
    );

    await waitFor(() => {
      expect(testMocks.router.replace).toHaveBeenCalledWith("/dashboard");
    });
    expect(localStorage.getItem("stanect:lastCompanionId")).toBeNull();
  });

  it("keeps the review open when create fails", async () => {
    const user = userEvent.setup();
    createCompanion.mockRejectedValue(
      new Error("Companion limit reached for your plan"),
    );
    seedCompanion();

    const { unmount } = renderWithProviders(<Preview />);

    await user.click(
      await screen.findByRole("button", { name: "Create Companion" }),
    );

    await waitFor(() => {
      expect(testMocks.toast.error).toHaveBeenCalledWith(
        "Companion limit reached for your plan",
      );
    });
    expect(
      screen.getByRole("button", { name: "Create Companion" }),
    ).toBeEnabled();
    expect(testMocks.router.replace).not.toHaveBeenCalled();

    unmount();

    expect(useTabFormStore.getState().companionName).toBe("  Mia  ");
  });

  it("jumps back to the step that needs an edit", async () => {
    const user = userEvent.setup();
    const onEditStep = vi.fn();
    seedCompanion();

    renderWithProviders(<Preview onEditStep={onEditStep} />);

    const edits = await screen.findAllByRole("button", { name: "Edit" });
    await user.click(edits[0]);
    await user.click(edits[1]);
    await user.click(edits[2]);

    expect(onEditStep).toHaveBeenNthCalledWith(1, 0);
    expect(onEditStep).toHaveBeenNthCalledWith(2, 1);
    expect(onEditStep).toHaveBeenNthCalledWith(3, 2);
  });
});
