import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import ConfirmDialog from "@/components/ui/ConfirmDialog";

function setup(props: Partial<React.ComponentProps<typeof ConfirmDialog>> = {}) {
  const onConfirm = vi.fn();
  const onOpenChange = vi.fn();
  const { unmount } = render(
    <ConfirmDialog
      open
      onOpenChange={onOpenChange}
      title="Delete thing?"
      description="This cannot be undone."
      confirmLabel="Yes, delete"
      onConfirm={onConfirm}
      {...props}
    />,
  );
  return { onConfirm, onOpenChange, unmount };
}

describe("ConfirmDialog", () => {
  it("shows the title and description with Cancel and the confirm label", () => {
    setup();

    expect(screen.getByText("Delete thing?")).toBeInTheDocument();
    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Yes, delete" }),
    ).toBeInTheDocument();
  });

  it("uses the same pill buttons, 44px tall, in both tones", () => {
    const { unmount } = render(
      <ConfirmDialog
        open
        title="A"
        description="B"
        confirmLabel="Remove"
        onConfirm={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: "Remove" })).toHaveClass(
      "bg-danger",
      "rounded-full",
      "h-11",
    );
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveClass(
      "rounded-full",
      "h-11",
    );
    unmount();

    render(
      <ConfirmDialog
        open
        tone="primary"
        title="A"
        description="B"
        confirmLabel="Continue"
        onConfirm={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: "Continue" })).toHaveClass(
      "from-brand-from",
      "rounded-full",
      "h-11",
    );
  });

  it("calls onConfirm and leaves the dialog open for the caller to close", async () => {
    const user = userEvent.setup();
    const { onConfirm, onOpenChange } = setup();

    await user.click(screen.getByRole("button", { name: "Yes, delete" }));

    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
    expect(screen.getByText("Delete thing?")).toBeInTheDocument();
  });

  it("asks to close when Cancel is pressed", async () => {
    const user = userEvent.setup();
    const { onConfirm, onOpenChange } = setup({ cancelLabel: "Keep it" });

    await user.click(screen.getByRole("button", { name: "Keep it" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("shows the pending label and locks both buttons while working", async () => {
    const user = userEvent.setup();
    const { onConfirm } = setup({ isPending: true, pendingLabel: "Deleting…" });

    const confirm = screen.getByRole("button", { name: "Deleting…" });
    expect(confirm).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();

    await user.click(confirm);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("opens from its trigger when used without open/onOpenChange", async () => {
    const user = userEvent.setup();
    render(
      <ConfirmDialog
        trigger={<button type="button">Open it</button>}
        title="Sure?"
        description="Really."
        confirmLabel="Do it"
        onConfirm={() => {}}
      />,
    );

    expect(screen.queryByText("Sure?")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open it" }));
    expect(await screen.findByText("Sure?")).toBeInTheDocument();
  });

  it("shows an icon badge only when an icon is given", () => {
    const { unmount } = setup({ icon: <svg data-testid="badge-icon" /> });
    expect(screen.getByTestId("badge-icon")).toBeInTheDocument();
    unmount();

    setup();
    expect(screen.queryByTestId("badge-icon")).not.toBeInTheDocument();
  });
});
