import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resetConvoStore } from "@/tests/support/convo";
import { useConvoStore } from "@/store/use-convo-store";

import { TranscriptPanel } from "@/components/ui/convo/TranscriptBlock";

vi.mock("@tanstack/react-virtual", () => ({
  useVirtualizer: ({ count }: { count: number }) => ({
    getTotalSize: () => count * 96,
    getVirtualItems: () =>
      Array.from({ length: count }, (_, index) => ({
        index,
        start: index * 96,
      })),
    measureElement: () => {},
    scrollToIndex: () => {},
  }),
}));

describe("TranscriptPanel", () => {
  beforeEach(() => {
    resetConvoStore();
  });

  afterEach(() => {
    resetConvoStore();
  });

  it("shows an empty transcript before anyone speaks", () => {
    useConvoStore.setState({ companionId: "c1", messages: [] });

    render(<TranscriptPanel companionId="c1" companionName="Mia" />);

    expect(
      screen.getByRole("heading", { name: "Live Transcript" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Transcript appears when you start talking."),
    ).toBeInTheDocument();
  });

  it("labels user lines as You and assistant lines with the companion name", () => {
    useConvoStore.setState({
      companionId: "c1",
      messages: [
        { id: "1", role: "user", content: "Hello" },
        { id: "2", role: "assistant", content: "Hi there" },
      ],
    });

    render(<TranscriptPanel companionId="c1" companionName="Mia" />);

    expect(screen.getByText("You")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Mia")).toBeInTheDocument();
    expect(screen.getByText("Hi there")).toBeInTheDocument();
  });

  it("hides messages saved for a different companion", () => {
    useConvoStore.setState({
      companionId: "c1",
      messages: [{ id: "1", role: "user", content: "Hello" }],
    });

    render(<TranscriptPanel companionId="c2" companionName="Alex" />);

    expect(
      screen.getByText("Transcript appears when you start talking."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Hello")).not.toBeInTheDocument();
  });
});
