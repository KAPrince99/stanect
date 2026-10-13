import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/tests/support/render";
import { resetTabFormStore } from "@/tests/support/tabForm";
import { useTabFormStore } from "@/store/useTabFormStore";

import Avatar from "@/components/ui/NewTabForm/Avatar";

const { getAvatars } = vi.hoisted(() => ({
  getAvatars: vi.fn(),
}));

vi.mock("@/app/(app)/actions/actions", () => ({
  getAvatars,
}));

const mia = { id: "a1", name: "Mia", image_url: "/mia.png" };
const alex = { id: "a2", name: "Alex", image_url: "/alex.png" };

function selectionRing(name: string) {
  return screen
    .getByRole("button", { name })
    .querySelector(".border-amber-500");
}

describe("Avatar", () => {
  beforeEach(() => {
    resetTabFormStore();
    getAvatars.mockReset();
  });

  afterEach(() => {
    resetTabFormStore();
  });

  it("shows a spinner until the avatar list loads", async () => {
    let resolveAvatars: (value: typeof mia[]) => void = () => {};
    getAvatars.mockReturnValue(
      new Promise((resolve) => {
        resolveAvatars = resolve;
      }),
    );

    renderWithProviders(<Avatar />);

    expect(
      screen.queryByRole("heading", { name: "Choose Your Muse" }),
    ).not.toBeInTheDocument();

    resolveAvatars([mia]);

    expect(
      await screen.findByRole("heading", { name: "Choose Your Muse" }),
    ).toBeInTheDocument();
  });

  it("shows an error when the avatar list fails", async () => {
    getAvatars.mockRejectedValue(new Error("unavailable"));

    renderWithProviders(<Avatar />);

    expect(await screen.findByText("Error loading avatars")).toBeInTheDocument();
  });

  it("leaves the step empty when there are no avatars", async () => {
    getAvatars.mockResolvedValue([]);

    renderWithProviders(<Avatar />);

    expect(
      await screen.findByRole("heading", { name: "Choose Your Muse" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(useTabFormStore.getState().selectedAvatarId).toBeNull();
  });

  it("selects the first avatar and lets a later one be chosen", async () => {
    const user = userEvent.setup();
    getAvatars.mockResolvedValue([mia, alex]);

    renderWithProviders(<Avatar />);

    await waitFor(() => {
      expect(selectionRing("Mia")).toBeTruthy();
    });
    expect(useTabFormStore.getState().selectedAvatarId).toBe("a1");

    await user.click(screen.getByRole("button", { name: "Alex" }));

    await waitFor(() => {
      expect(selectionRing("Alex")).toBeTruthy();
    });
    expect(selectionRing("Mia")).toBeNull();
    expect(useTabFormStore.getState().selectedAvatarId).toBe("a2");
  });

  it("replaces a saved avatar that is no longer in the list", async () => {
    getAvatars.mockResolvedValue([mia, alex]);
    useTabFormStore.setState({ selectedAvatarId: "gone" });

    renderWithProviders(<Avatar />);

    await waitFor(() => {
      expect(useTabFormStore.getState().selectedAvatarId).toBe("a1");
    });
    expect(selectionRing("Mia")).toBeTruthy();
  });
});
