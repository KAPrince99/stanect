import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resetConvoStore } from "@/tests/support/convo";
import { useConvoStore } from "@/store/use-convo-store";

import ConvoLiveTimer from "@/components/ui/convo/ConvoLiveTimer";

vi.mock("@/lib/vapiSdk", () => ({
  getVapiSdk: vi.fn(async () => ({
    start: vi.fn(),
    stop: vi.fn(),
    setMuted: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  })),
  extractVapiCallId: () => null,
}));

describe("ConvoLiveTimer", () => {
  beforeEach(() => {
    resetConvoStore();
  });

  afterEach(() => {
    resetConvoStore();
  });

  it("formats 90 seconds as 1:30", () => {
    useConvoStore.setState({ timeLeft: 90 });

    render(<ConvoLiveTimer />);

    expect(screen.getByText("1:30")).toBeInTheDocument();
  });

  it("renders nothing when the clock is empty", () => {
    useConvoStore.setState({ timeLeft: null });

    const { container } = render(<ConvoLiveTimer />);

    expect(container).toBeEmptyDOMElement();
  });

  it("opens the end dialog when the clock runs out", () => {
    useConvoStore.setState({ callStatus: "ACTIVE", timeLeft: 1, showEndModal: false });

    useConvoStore.getState().tickTimer();

    expect(useConvoStore.getState().timeLeft).toBe(0);
    expect(useConvoStore.getState().showEndModal).toBe(true);
  });
});
