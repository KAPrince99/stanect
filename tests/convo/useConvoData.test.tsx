import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useConvoData } from "@/hooks/useConvoData";
import { testMocks } from "@/tests/support/mocks";
import { createTestQueryClient } from "@/tests/support/render";

const { getSingleCompanion, getUser, fetchSubscriptionStatus } = vi.hoisted(
  () => ({
    getSingleCompanion: vi.fn(),
    getUser: vi.fn(),
    fetchSubscriptionStatus: vi.fn(),
  }),
);

vi.mock("@/app/(app)/actions/actions", () => ({
  getSingleCompanion,
  getUser,
}));

vi.mock("@/app/(app)/actions/subs", () => ({
  fetchSubscriptionStatus,
}));

function renderConvoData() {
  const queryClient = createTestQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return renderHook(() => useConvoData("c1"), { wrapper });
}

describe("useConvoData profile picture", () => {
  beforeEach(() => {
    getSingleCompanion.mockReset();
    getUser.mockReset();
    fetchSubscriptionStatus.mockReset();
    getSingleCompanion.mockResolvedValue({ id: "c1", companion_name: "Mia" });
    fetchSubscriptionStatus.mockResolvedValue({ plan: "free" });
  });

  it("prefers the saved profile photo", async () => {
    testMocks.clerk.user.imageUrl = "https://img.clerk.test/ada.png";
    getUser.mockResolvedValue({ profile_picture: "/avatars/saved.jpg" });

    const { result } = renderConvoData();

    await waitFor(() => {
      expect(result.current.userAvatarUrl).toBe("/avatars/saved.jpg");
    });
  });

  it("falls back to the Clerk photo, then the default", async () => {
    testMocks.clerk.user.imageUrl = "https://img.clerk.test/ada.png";
    getUser.mockResolvedValue({ profile_picture: "" });

    const withClerk = renderConvoData();

    await waitFor(() => {
      expect(getUser).toHaveBeenCalled();
    });
    expect(withClerk.result.current.userAvatarUrl).toBe(
      "https://img.clerk.test/ada.png",
    );

    withClerk.unmount();
    testMocks.clerk.user.imageUrl = "";
    const withDefault = renderConvoData();

    await waitFor(() => {
      expect(withDefault.result.current.companion).not.toBeNull();
    });
    expect(withDefault.result.current.userAvatarUrl).toBe(
      "/avatars/avatar_0.jpg",
    );
  });

  it("does not hold the call screen back while the picture loads", async () => {
    testMocks.clerk.user.imageUrl = "";
    getUser.mockReturnValue(new Promise(() => {}));

    const { result } = renderConvoData();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.userAvatarUrl).toBe("/avatars/avatar_0.jpg");
  });
});
