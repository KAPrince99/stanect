import { waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resetConvoStore } from "@/tests/support/convo";
import { renderWithProviders } from "@/tests/support/render";
import { useConvoStore } from "@/store/use-convo-store";
import { useCompanionTranscript } from "@/hooks/useCompanionTranscript";

const { getCompanionSessions } = vi.hoisted(() => ({
  getCompanionSessions: vi.fn(),
}));

vi.mock("@/app/(app)/actions/sessions", () => ({
  getCompanionSessions,
}));

function Harness({ companionId }: { companionId: string }) {
  useCompanionTranscript(companionId);
  return null;
}

describe("useCompanionTranscript", () => {
  beforeEach(() => {
    resetConvoStore();
    getCompanionSessions.mockReset();
  });

  afterEach(() => {
    resetConvoStore();
  });

  it("writes saved lines after they load and marks the transcript ready", async () => {
    let resolveSessions: (value: unknown) => void = () => {};
    getCompanionSessions.mockReturnValue(
      new Promise((resolve) => {
        resolveSessions = resolve;
      }),
    );

    renderWithProviders(<Harness companionId="c1" />);

    await waitFor(() => {
      expect(useConvoStore.getState().companionId).toBe("c1");
    });
    expect(useConvoStore.getState().transcriptReady).toBe(false);
    expect(useConvoStore.getState().messages).toEqual([]);

    resolveSessions([
      {
        companion_id: "c1",
        transcript: [
          { role: "user", content: "Hello" },
          { role: "assistant", content: "Hi there" },
        ],
      },
    ]);

    await waitFor(() => {
      expect(useConvoStore.getState().transcriptReady).toBe(true);
    });
    expect(useConvoStore.getState().messages).toEqual([
      { id: "c1-0", role: "user", content: "Hello" },
      { id: "c1-1", role: "assistant", content: "Hi there" },
    ]);
  });

  it("marks the transcript ready when there are no saved lines", async () => {
    getCompanionSessions.mockResolvedValue([]);

    renderWithProviders(<Harness companionId="c1" />);

    await waitFor(() => {
      expect(useConvoStore.getState().transcriptReady).toBe(true);
    });
    expect(useConvoStore.getState().messages).toEqual([]);
  });

  it("does not replace live messages while a call is connecting", async () => {
    useConvoStore.setState({
      companionId: "c1",
      callStatus: "CONNECTING",
      messages: [{ id: "live", role: "user", content: "now" }],
      transcriptReady: false,
    });
    getCompanionSessions.mockResolvedValue([
      {
        companion_id: "c1",
        transcript: [{ role: "assistant", content: "old" }],
      },
    ]);

    renderWithProviders(<Harness companionId="c1" />);

    await waitFor(() => {
      expect(useConvoStore.getState().transcriptReady).toBe(true);
    });
    expect(useConvoStore.getState().messages).toEqual([
      { id: "live", role: "user", content: "now" },
    ]);
  });
});
