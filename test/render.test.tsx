import { useQueryClient } from "@tanstack/react-query";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { describe, expect, it } from "vitest";

import { testMocks } from "./mocks";
import { renderWithProviders } from "./render";

function Probe() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useUser();

  return (
    <button
      type="button"
      onClick={() => {
        router.push("/dashboard");
        toast.success("Saved");
      }}
    >
      {queryClient ? user?.firstName : "missing"}
    </button>
  );
}

describe("renderWithProviders", () => {
  it("renders with a query client and the shared router, Clerk, and toast mocks", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Probe />);

    await user.click(screen.getByRole("button", { name: "Ada" }));

    expect(useRouter().push).toHaveBeenCalledWith("/dashboard");
    expect(testMocks.toast.success).toHaveBeenCalledWith("Saved");
  });
});
