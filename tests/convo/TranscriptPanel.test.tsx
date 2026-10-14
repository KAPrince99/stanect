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
    useConvoStore.setState({
      companionId: "c1",
      messages: [],
      transcriptReady: true,
    });

    render(<TranscriptPanel companionId="c1" companionName="Mia" />);

    expect(
      screen.getByRole("heading", { name: "Live Transcript" }),
    ).toBeInTheDocument();
    const empty = screen.getByText(
      "Transcript appears when you start talking.",
    );
    expect(empty).toBeInTheDocument();
    expect(empty.parentElement).toHaveClass("scrollbar-hide", "overflow-y-auto");
    expect(empty.closest("aside")).toHaveClass("bg-white/10", "backdrop-blur-2xl");
  });

  it("shows ghost lines while saved transcripts are loading", () => {
    useConvoStore.setState({
      companionId: "c1",
      messages: [],
      transcriptReady: false,
    });

    render(<TranscriptPanel companionId="c1" companionName="Mia" />);

    expect(
      screen.getByRole("status", { name: "Loading transcript" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Transcript appears when you start talking."),
    ).not.toBeInTheDocument();
  });

  it("does not skeleton over a live call with no lines yet", () => {
    useConvoStore.setState({
      companionId: "c1",
      messages: [],
      transcriptReady: false,
      callStatus: "CONNECTING",
    });

    render(<TranscriptPanel companionId="c1" companionName="Mia" />);

    expect(
      screen.queryByRole("status", { name: "Loading transcript" }),
    ).not.toBeInTheDocument();
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
      transcriptReady: true,
    });

    render(<TranscriptPanel companionId="c2" companionName="Alex" />);

    expect(
      screen.getByText("Transcript appears when you start talking."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Hello")).not.toBeInTheDocument();
  });
});
