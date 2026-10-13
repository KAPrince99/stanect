import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { testMocks } from "@/tests/support/mocks";
import { renderWithProviders } from "@/tests/support/render";

import UpdateProfile from "@/components/ui/profileRelated/updateProfile";

const { updateProfile } = vi.hoisted(() => ({
  updateProfile: vi.fn(),
}));

vi.mock("@/app/(app)/actions/update", () => ({
  updateProfile,
}));

const profile = {
  name: "Ada Lovelace",
  country: "London",
  profile_picture: "/avatars/ada.jpg",
};

describe("UpdateProfile", () => {
  beforeEach(() => {
    updateProfile.mockReset();
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn(() => "blob:preview"),
      revokeObjectURL: vi.fn(),
    });
  });

  it("fills the dialog from the saved profile", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <UpdateProfile
        data={profile}
        user={testMocks.clerk.user}
        userFirstNameInitial="A"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Update Profile" }));

    expect(await screen.findByDisplayValue("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByDisplayValue("London")).toBeInTheDocument();
  });

  it("refuses to save a blank name", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <UpdateProfile
        data={profile}
        user={testMocks.clerk.user}
        userFirstNameInitial="A"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Update Profile" }));
    await user.clear(await screen.findByDisplayValue("Ada Lovelace"));
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(testMocks.toast.error).toHaveBeenCalledWith("Name is required");
    expect(updateProfile).not.toHaveBeenCalled();
    expect(
      screen.getByRole("heading", { name: "Update your profile" }),
    ).toBeInTheDocument();
  });

  it("saves a trimmed name, location, and chosen photo", async () => {
    const user = userEvent.setup();
    updateProfile.mockResolvedValue(undefined);
    const { queryClient } = renderWithProviders(
      <UpdateProfile
        data={profile}
        user={testMocks.clerk.user}
        userFirstNameInitial="A"
      />,
    );
    const invalidate = vi.spyOn(queryClient, "invalidateQueries");

    await user.click(screen.getByRole("button", { name: "Update Profile" }));
    const name = await screen.findByDisplayValue("Ada Lovelace");
    await user.clear(name);
    await user.type(name, "  Ada  ");
    const location = screen.getByDisplayValue("London");
    await user.clear(location);
    await user.upload(document.querySelector('input[type="file"]') as HTMLInputElement, [
      new File(["photo"], "ada.png", { type: "image/png" }),
    ]);

    await user.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledTimes(1);
    });
    const formData = updateProfile.mock.calls[0][0] as FormData;
    expect(formData.get("name")).toBe("Ada");
    expect(formData.get("country")).toBe("Earth");
    expect(formData.get("image")).toBeInstanceOf(File);
    expect(updateProfile.mock.calls[0][1]).toBe("/avatars/ada.jpg");
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ["users", "user_test"],
    });
    expect(testMocks.toast.success).toHaveBeenCalledWith(
      "Profile updated successfully",
    );
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "Update your profile" }),
      ).not.toBeInTheDocument();
    });
  });

  it("keeps the dialog open when the save fails", async () => {
    const user = userEvent.setup();
    updateProfile.mockRejectedValue(new Error("Storage down"));

    renderWithProviders(
      <UpdateProfile
        data={profile}
        user={testMocks.clerk.user}
        userFirstNameInitial="A"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Update Profile" }));
    await user.click(await screen.findByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(testMocks.toast.error).toHaveBeenCalledWith("Storage down");
    });
    expect(
      screen.getByRole("heading", { name: "Update your profile" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save changes" })).toBeEnabled();
  });

  it("restores the saved values when the dialog is opened again", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <UpdateProfile
        data={{ ...profile, country: "" }}
        user={testMocks.clerk.user}
        userFirstNameInitial="A"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Update Profile" }));
    expect(await screen.findByDisplayValue("Earth")).toBeInTheDocument();
    const name = screen.getByDisplayValue("Ada Lovelace");
    await user.clear(name);
    await user.type(name, "Temporary");
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await user.click(screen.getByRole("button", { name: "Update Profile" }));

    expect(await screen.findByDisplayValue("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Earth")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("Temporary")).not.toBeInTheDocument();
  });
});
