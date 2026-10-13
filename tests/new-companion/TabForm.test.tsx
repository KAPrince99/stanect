import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { testMocks } from "@/tests/support/mocks";
import { renderWithProviders } from "@/tests/support/render";
import { resetTabFormStore } from "@/tests/support/tabForm";

import TabForm from "@/components/ui/NewTabForm/TabForm";

const { getAvatars, getSingleAvatar, createCompanion } = vi.hoisted(() => ({
  getAvatars: vi.fn(),
  getSingleAvatar: vi.fn(),
  createCompanion: vi.fn(),
}));

vi.mock("@/app/(app)/actions/actions", () => ({
  getAvatars,
  getSingleAvatar,
  createCompanion,
}));

const mia = { id: "a1", name: "Mia", image_url: "/mia.png" };
const alex = { id: "a2", name: "Alex", image_url: "/alex.png" };

function nextButton() {
  return screen.getByRole("button", { name: "Go to next tab" });
}

describe("TabForm", () => {
  beforeEach(() => {
    resetTabFormStore();
    getAvatars.mockReset();
    getSingleAvatar.mockReset();
    createCompanion.mockReset();
    getAvatars.mockResolvedValue([mia, alex]);
    getSingleAvatar.mockImplementation(async (id?: string) => {
      return [mia, alex].find((avatar) => avatar.id === id) ?? mia;
    });
    createCompanion.mockResolvedValue({ data: { id: "c1" } });
  });

  afterEach(() => {
    resetTabFormStore();
  });

  it("walks avatar, person, and voice, then creates the companion", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TabForm />);

    expect(
      await screen.findByRole("heading", { name: "Choose Your Muse" }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(nextButton()).toBeEnabled();
    });

    await user.click(nextButton());
    expect(
      screen.getByRole("heading", { name: "Create Your Character" }),
    ).toBeInTheDocument();
    await user.type(
      screen.getByPlaceholderText("Sophia • Alex • Mia..."),
      "  Mia  ",
    );
    await user.type(
      screen.getByPlaceholderText("Gym • Coffee Shop • Bookstore..."),
      "  Gym  ",
    );

    await user.click(nextButton());
    expect(
      screen.getByRole("heading", { name: "Voice and Session Length" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "female" }));
    fireEvent.change(screen.getByPlaceholderText("1 - 2"), {
      target: { value: "2" },
    });

    await user.click(nextButton());
    expect(
      await screen.findByRole("heading", { name: "Review companion" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Create Companion" }));

    await waitFor(() => {
      expect(createCompanion).toHaveBeenCalledWith({
        avatar_id: "a1",
        companion_name: "Mia",
        scene: "Gym",
        voice: "female",
        duration: "2",
      });
    });
    expect(testMocks.toast.success).toHaveBeenCalledWith(
      "Companion created successfully",
    );
    expect(testMocks.router.replace).toHaveBeenCalledWith("/dashboard/c1");
  });

  it("blocks later tabs until an avatar is chosen", async () => {
    const user = userEvent.setup();
    let resolveAvatars: (value: typeof mia[]) => void = () => {};
    getAvatars.mockReturnValue(
      new Promise((resolve) => {
        resolveAvatars = resolve;
      }),
    );

    renderWithProviders(<TabForm />);

    await user.click(screen.getByRole("button", { name: "Preview" }));

    expect(testMocks.toast.error).toHaveBeenCalledWith(
      "Complete previous steps first",
    );
    expect(nextButton()).toBeDisabled();

    resolveAvatars([mia]);
    await screen.findByRole("heading", { name: "Choose Your Muse" });
  });

  it("stays on avatar when the list is empty", async () => {
    const user = userEvent.setup();
    getAvatars.mockResolvedValue([]);

    renderWithProviders(<TabForm />);

    expect(
      await screen.findByRole("heading", { name: "Choose Your Muse" }),
    ).toBeInTheDocument();
    expect(nextButton()).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Person" }));

    expect(testMocks.toast.error).toHaveBeenCalledWith(
      "Complete previous steps first",
    );
    expect(
      screen.getByRole("heading", { name: "Choose Your Muse" }),
    ).toBeInTheDocument();
  });

  it("keeps next disabled for a one-character name", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TabForm />);

    await screen.findByRole("heading", { name: "Choose Your Muse" });
    await waitFor(() => {
      expect(nextButton()).toBeEnabled();
    });
    await user.click(nextButton());
    await user.type(screen.getByPlaceholderText("Sophia • Alex • Mia..."), "A");

    expect(
      screen.getByText("Name must be at least 2 characters"),
    ).toBeInTheDocument();
    expect(nextButton()).toBeDisabled();
  });

  it("snaps an over-cap session back to the free limit and unlocks next", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TabForm />);

    await screen.findByRole("heading", { name: "Choose Your Muse" });
    await waitFor(() => {
      expect(nextButton()).toBeEnabled();
    });
    await user.click(nextButton());
    await user.type(screen.getByPlaceholderText("Sophia • Alex • Mia..."), "Mia");
    await user.type(
      screen.getByPlaceholderText("Gym • Coffee Shop • Bookstore..."),
      "Gym",
    );
    await user.click(nextButton());

    fireEvent.change(screen.getByPlaceholderText("1 - 2"), {
      target: { value: "10" },
    });

    expect(screen.getByPlaceholderText("1 - 2")).toHaveValue(2);
    expect(
      screen.getByText("Your free plan limit is 2 mins"),
    ).toBeInTheDocument();
    expect(nextButton()).toBeEnabled();
  });
});
