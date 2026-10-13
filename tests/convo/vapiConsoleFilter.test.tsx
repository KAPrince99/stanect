import { renderHook, waitFor } from "@testing-library/react";
import { EventEmitter } from "node:events";
import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useConvoSession } from "@/hooks/useConvoSession";

import { resetConvoStore } from "../support/convo";
import { createTestQueryClient } from "../support/render";

const fakeVapi = vi.hoisted(() => ({ current: null as unknown }));

vi.mock("@/lib/vapiSdk", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/vapiSdk")>()),
  getVapiSdk: async () => fakeVapi.current,
}));

vi.mock("@/app/(app)/actions/actions", () => ({
  assertCanStartCall: vi.fn(),
  finalizeCallUsage: vi.fn().mockResolvedValue({}),
}));

const playSound = vi.hoisted(() => vi.fn());
vi.mock("use-sound", () => ({ default: () => [playSound] }));

const DAILY_WARNING =
  "Ignoring settings for browser- or platform-unsupported input processor(s): audio";

let errorSpy: ReturnType<typeof vi.spyOn>;
let warnSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  resetConvoStore();
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  errorSpy.mockRestore();
  warnSpy.mockRestore();
});

async function mountSession() {
  const vapi = new EventEmitter();
  fakeVapi.current = {
    on: vapi.on.bind(vapi),
    off: vapi.off.bind(vapi),
    start: vi.fn(),
    stop: vi.fn(),
    setMuted: vi.fn(),
  };

  const queryClient = createTestQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const view = renderHook(
    () => useConvoSession({ assistantId: "a1", userId: "u1" }),
    { wrapper },
  );
  await waitFor(() => expect(vapi.listenerCount("message")).toBe(1));

  return view;
}

describe("console noise from the Vapi / Daily SDK", () => {
  it("turns Daily's unsupported noise cancellation warning into a plain warning", async () => {
    const { unmount } = await mountSession();
    const patchedError = console.error;
    errorSpy.mockClear();

    patchedError(DAILY_WARNING);

    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(DAILY_WARNING);
    unmount();
  });

  it("still reports real errors as errors", async () => {
    const { unmount } = await mountSession();
    const patchedError = console.error;
    errorSpy.mockClear();

    patchedError("Failed to get user media");

    expect(errorSpy).toHaveBeenCalledWith("Failed to get user media");
    expect(warnSpy).not.toHaveBeenCalled();
    unmount();
  });

  it("still silences the normal hangup noise", async () => {
    const { unmount } = await mountSession();
    const patchedError = console.error;
    errorSpy.mockClear();

    patchedError("Meeting has ended");

    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    unmount();
  });

  it("puts console.error back when the page goes away", async () => {
    const before = console.error;
    const { unmount } = await mountSession();
    expect(console.error).not.toBe(before);

    unmount();

    expect(console.error).toBe(before);
  });
});
