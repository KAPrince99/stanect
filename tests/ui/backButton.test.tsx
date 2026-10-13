import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import BackButton from "@/components/ui/BackButton";

describe("BackButton", () => {
  it("is a round glass button that goes back to the dashboard by default", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<BackButton onClick={onClick} />);

    const button = screen.getByRole("button", { name: "Back to dashboard" });
    expect(button).toHaveClass("rounded-full", "size-11");

    await user.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("accepts another accessible name", () => {
    render(<BackButton onClick={() => {}} label="Back to pricing" />);

    expect(
      screen.getByRole("button", { name: "Back to pricing" }),
    ).toBeInTheDocument();
  });
});
