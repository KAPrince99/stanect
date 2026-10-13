import { act, renderHook, waitFor } from "@testing-library/react";
import { EventEmitter } from "node:events";
import { StrictMode, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useConvoStore } from "@/store/use-convo-store";
import { useConvoSession } from "@/hooks/useConvoSession";
import { SPEAKER_STUCK_MS } from "@/lib/speaker-watchdog";
import { subscribeVoiceLevel } from "@/lib/voice-level";
import { VOICE_ACTIVITY } from "@/lib/voice-activity";

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

const speech = (role: "assistant" | "user", status: "started" | "stopped") => ({
  type: "speech-update" as const,
  role,
  status,
});

const { applySpeechEvent, setCallStatus, setMuted } = useConvoStore.getState();
const speaker = () => useConvoStore.getState().speaker;

beforeEach(() => {
  resetConvoStore();
  setCallStatus("ACTIVE");
});

describe("who is speaking (store)", () => {
  it("starts with nobody speaking", () => {
    expect(speaker()).toBeNull();
  });

  it("tracks the assistant starting and stopping", () => {
    applySpeechEvent(speech("assistant", "started"));
    expect(speaker()).toBe("assistant");

    applySpeechEvent(speech("assistant", "stopped"));
    expect(speaker()).toBeNull();
  });

  it("tracks the user starting and stopping", () => {
    applySpeechEvent(speech("user", "started"));
    expect(speaker()).toBe("user");

    applySpeechEvent(speech("user", "stopped"));
    expect(speaker()).toBeNull();
  });

  it("hands over cleanly when the user interrupts, whatever order the events arrive in", () => {
    applySpeechEvent(speech("assistant", "started"));

    // stop arrives late, after the user already started
    applySpeechEvent(speech("user", "started"));
    applySpeechEvent(speech("assistant", "stopped"));
    expect(speaker()).toBe("user");

    applySpeechEvent(speech("user", "stopped"));
    expect(speaker()).toBeNull();
  });

  it("treats a user-interrupted message as the assistant going quiet", () => {
    applySpeechEvent(speech("assistant", "started"));
    applySpeechEvent({ type: "user-interrupted" });
    expect(speaker()).toBeNull();
  });

  it("keeps the user as speaker when user-interrupted arrives after they started", () => {
    applySpeechEvent(speech("assistant", "started"));
    applySpeechEvent(speech("user", "started"));
    applySpeechEvent({ type: "user-interrupted" });
    expect(speaker()).toBe("user");
  });

  it("ignores a started event from the user while muted", () => {
    setMuted(true);
    applySpeechEvent(speech("user", "started"));
    expect(speaker()).toBeNull();
  });

  it("still shows the assistant while the user is muted", () => {
    setMuted(true);
    applySpeechEvent(speech("assistant", "started"));
    expect(speaker()).toBe("assistant");
  });

  it("clears the user's speaking state the moment they mute", () => {
    applySpeechEvent(speech("user", "started"));
    setMuted(true);
    expect(speaker()).toBeNull();
  });

  it("does not clear the assistant when the user mutes", () => {
    applySpeechEvent(speech("assistant", "started"));
    setMuted(true);
    expect(speaker()).toBe("assistant");
  });

  it.each(["INACTIVE", "ERROR"] as const)(
    "clears the speaker when the call goes %s",
    (status) => {
      applySpeechEvent(speech("assistant", "started"));
      setCallStatus(status);
      expect(speaker()).toBeNull();
    },
  );

  it("ignores late speech events after the call is over", () => {
    setCallStatus("INACTIVE");
    applySpeechEvent(speech("assistant", "started"));
    expect(speaker()).toBeNull();
  });

  it("clears the speaker when the chat is cleared or another companion is opened", () => {
    applySpeechEvent(speech("assistant", "started"));
    useConvoStore.getState().clearChat();
    expect(speaker()).toBeNull();

    setCallStatus("ACTIVE");
    applySpeechEvent(speech("user", "started"));
    useConvoStore.getState().bindCompanion("another-companion");
    expect(speaker()).toBeNull();
  });

  it.each([
    null,
    undefined,
    "speech-update",
    42,
    {},
    { type: "transcript", role: "assistant" },
    { type: "speech-update", role: "assistant" },
    { type: "speech-update", status: "started" },
    { type: "speech-update", status: "started", role: "narrator" },
    { type: "speech-update", status: "paused", role: "user" },
  ])("ignores malformed or unrelated messages (%j)", (message) => {
    applySpeechEvent(speech("assistant", "started"));
    applySpeechEvent(message);
    expect(speaker()).toBe("assistant");
  });

  it("is never shared with other tabs", () => {
    applySpeechEvent(speech("assistant", "started"));
    const stored = localStorage.getItem("stanect-convo-sync") ?? "{}";
    expect(JSON.parse(stored)).not.toHaveProperty("speaker");
  });
});

describe("who is speaking (from the microphone)", () => {
  const { setUserSpeaking } = useConvoStore.getState();

  it("lights up the user at once, without waiting for Vapi", () => {
    setUserSpeaking(true);
    expect(speaker()).toBe("user");
  });

  it("clears the user when the mic goes quiet", () => {
    setUserSpeaking(true);
    setUserSpeaking(false);
    expect(speaker()).toBeNull();
  });

  it("does not clear the companion's ring when the mic goes quiet", () => {
    setUserSpeaking(true);
    applySpeechEvent(speech("assistant", "started"));

    setUserSpeaking(false);

    expect(speaker()).toBe("assistant");
  });

  it("ignores the mic while muted", () => {
    setMuted(true);
    setUserSpeaking(true);
    expect(speaker()).toBeNull();
  });

  it.each(["INACTIVE", "CONNECTING", "ERROR"] as const)(
    "ignores the mic when the call is %s",
    (status) => {
      setCallStatus(status);
      setUserSpeaking(true);
      expect(speaker()).toBeNull();
    },
  );

  it("keeps the ring on when Vapi says the user stopped but the mic still hears them", () => {
    setUserSpeaking(true);

    applySpeechEvent(speech("user", "stopped"));

    expect(speaker()).toBe("user");

    setUserSpeaking(false);
    expect(speaker()).toBeNull();
  });

  it("still lets Vapi's stop clear the user when the mic never heard them", () => {
    applySpeechEvent(speech("user", "started"));
    applySpeechEvent(speech("user", "stopped"));
    expect(speaker()).toBeNull();
  });

  it("forgets the mic state on mute, call end and a new call", () => {
    setUserSpeaking(true);
    setMuted(true);
    expect(useConvoStore.getState().localVoiceActive).toBe(false);

    setMuted(false);
    setUserSpeaking(true);
    setCallStatus("INACTIVE");
    expect(useConvoStore.getState().localVoiceActive).toBe(false);
    expect(speaker()).toBeNull();
  });
});
describe("who is speaking (wired to Vapi messages)", () => {
  it("updates the speaker from real Vapi `message` events and stops listening on unmount", async () => {
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

    const { unmount } = renderHook(
      () => useConvoSession({ assistantId: "a1", userId: "u1" }),
      { wrapper },
    );
    await waitFor(() => expect(vapi.listenerCount("message")).toBe(1));

    act(() => {
      vapi.emit("message", speech("assistant", "started"));
    });
    expect(speaker()).toBe("assistant");

    act(() => {
      vapi.emit("message", speech("assistant", "stopped"));
      vapi.emit("message", speech("user", "started"));
    });
    expect(speaker()).toBe("user");

    unmount();
    expect(vapi.listenerCount("message")).toBe(0);
  });

  it("never leaves a stray listener when the session restarts before the SDK finishes loading", async () => {
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
      <StrictMode>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </StrictMode>
    );

    const { rerender, unmount } = renderHook(
      ({ assistantId }) => useConvoSession({ assistantId, userId: "u1" }),
      { wrapper, initialProps: { assistantId: "a1" } },
    );
    // Effect deps change straight away, before getVapiSdk() has resolved.
    rerender({ assistantId: "a2" });

    await waitFor(() => expect(vapi.listenerCount("message")).toBeGreaterThan(0));
    await act(async () => {
      await Promise.resolve();
    });
    expect(vapi.listenerCount("message")).toBe(1);

    unmount();
    expect(vapi.listenerCount("message")).toBe(0);
  });
});

describe("who is speaking (mic level wired from Vapi)", () => {
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
    await waitFor(() =>
      expect(vapi.listenerCount("local-volume-level")).toBe(1),
    );

    return { vapi, ...view };
  }

  const level = (vapi: EventEmitter, value: number) =>
    act(() => {
      vapi.emit("local-volume-level", value);
    });

  it("shows the user speaking from the first loud mic reading", async () => {
    const { vapi } = await mountSession();

    level(vapi, 0.5);

    expect(speaker()).toBe("user");
  });

  it("clears the user shortly after the mic goes quiet", async () => {
    const { vapi } = await mountSession();
    level(vapi, 0.5);

    level(vapi, 0);

    expect(speaker()).toBe("user"); // not instantly: it bridges pauses between words
    await waitFor(() => expect(speaker()).toBeNull(), { timeout: 2000 });
  });

  it("does not light the user's ring for a quiet reading", async () => {
    const { vapi } = await mountSession();

    level(vapi, 0.001);

    expect(speaker()).toBeNull();
  });

  it("ignores her voice leaking into the mic, but not a clear interruption", async () => {
    const { vapi } = await mountSession();
    applySpeechEvent(speech("assistant", "started"));

    level(vapi, 0.06); // louder than normal background, quieter than a real voice
    expect(speaker()).toBe("assistant");

    level(vapi, 0.6);
    expect(speaker()).toBe("user");
  });

  it("goes calm straight away when the user mutes, and stays calm", async () => {
    const { vapi } = await mountSession();
    level(vapi, 0.5);
    expect(speaker()).toBe("user");

    act(() => setMuted(true));
    expect(speaker()).toBeNull();

    level(vapi, 0.5);
    expect(speaker()).toBeNull();
  });

  it("can speak again after unmuting", async () => {
    const { vapi } = await mountSession();
    level(vapi, 0.5);
    act(() => setMuted(true));
    act(() => setMuted(false));

    level(vapi, 0.5);

    expect(speaker()).toBe("user");
  });

  it("goes calm when the call ends mid-sentence", async () => {
    const { vapi } = await mountSession();
    level(vapi, 0.5);

    act(() => setCallStatus("INACTIVE"));

    expect(speaker()).toBeNull();
  });

  it("stops listening to the mic on unmount", async () => {
    const { vapi, unmount } = await mountSession();

    unmount();

    expect(vapi.listenerCount("local-volume-level")).toBe(0);
  });
});

describe("stuck ring safety net (wired to Vapi)", () => {
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
    await waitFor(() =>
      expect(vapi.listenerCount("volume-level")).toBe(1),
    );

    // Fake timers only after the async setup, so waitFor above still works.
    vi.useFakeTimers();

    return { vapi, ...view };
  }

  const emit = (vapi: EventEmitter, event: string, payload: unknown) =>
    act(() => {
      vapi.emit(event, payload);
    });

  const wait = (ms: number) =>
    act(() => {
      vi.advanceTimersByTime(ms);
    });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("clears a companion ring whose 'stopped' message never arrived", async () => {
    const { vapi } = await mountSession();
    emit(vapi, "message", speech("assistant", "started"));
    expect(speaker()).toBe("assistant");

    wait(SPEAKER_STUCK_MS - 1);
    expect(speaker()).toBe("assistant");

    wait(1);
    expect(speaker()).toBeNull();
  });

  it("clears a user ring whose 'stopped' message never arrived", async () => {
    const { vapi } = await mountSession();
    emit(vapi, "message", speech("user", "started"));
    expect(speaker()).toBe("user");

    wait(SPEAKER_STUCK_MS);

    expect(speaker()).toBeNull();
  });

  it("keeps the companion's ring through a long answer while her audio is playing", async () => {
    const { vapi } = await mountSession();
    emit(vapi, "message", speech("assistant", "started"));

    for (let second = 0; second < 40; second++) {
      wait(1000);
      emit(vapi, "volume-level", 0.4); // her voice is playing
    }

    expect(speaker()).toBe("assistant");
  });

  it("keeps the companion's ring while her live transcript keeps streaming", async () => {
    const { vapi } = await mountSession();
    emit(vapi, "message", speech("assistant", "started"));

    for (let second = 0; second < 20; second++) {
      wait(2000);
      emit(vapi, "message", {
        type: "transcript",
        role: "assistant",
        transcriptType: "partial",
        transcript: "still talking",
      });
    }

    expect(speaker()).toBe("assistant");
  });

  it("does not count near-silent audio as a sign of life", async () => {
    const { vapi } = await mountSession();
    emit(vapi, "message", speech("assistant", "started"));

    for (let second = 0; second < 6; second++) {
      wait(1000);
      emit(vapi, "volume-level", 0.001);
    }

    expect(speaker()).toBeNull();
  });

  it("does not let the user's transcript keep the companion's ring alive", async () => {
    const { vapi } = await mountSession();
    emit(vapi, "message", speech("assistant", "started"));

    for (let second = 0; second < 6; second++) {
      wait(1000);
      emit(vapi, "message", {
        type: "transcript",
        role: "user",
        transcriptType: "partial",
        transcript: "hello",
      });
    }

    expect(speaker()).toBeNull();
  });

  it("keeps the user's ring while the mic keeps hearing them", async () => {
    const { vapi } = await mountSession();
    emit(vapi, "local-volume-level", 0.5);
    expect(speaker()).toBe("user");

    for (let second = 0; second < 30; second++) {
      wait(1000);
      // Never dropped, not even for a moment, so the ring does not flash.
      expect(speaker()).toBe("user");
      emit(vapi, "local-volume-level", 0.5);
      expect(speaker()).toBe("user");
    }
  });

  it("clears the user's ring by the normal path, not only the safety net", async () => {
    const { vapi } = await mountSession();
    emit(vapi, "local-volume-level", 0.5);
    emit(vapi, "local-volume-level", 0);

    wait(VOICE_ACTIVITY.holdMs);

    expect(speaker()).toBeNull();
  });

  it("lets a fresh speaker get a fresh clock when the ring changes hands", async () => {
    const { vapi } = await mountSession();
    emit(vapi, "message", speech("assistant", "started"));
    wait(SPEAKER_STUCK_MS - 500);

    emit(vapi, "message", speech("user", "started"));
    wait(SPEAKER_STUCK_MS - 500);

    expect(speaker()).toBe("user"); // clock restarted for the new speaker
  });

  it("stops the clock when the ring clears normally, so nothing fires late", async () => {
    const { vapi } = await mountSession();
    emit(vapi, "message", speech("assistant", "started"));
    emit(vapi, "message", speech("assistant", "stopped"));
    emit(vapi, "message", speech("assistant", "started"));
    emit(vapi, "message", speech("assistant", "stopped"));

    // A late firing would write to the store (even if only to say "nobody").
    const storeWrites = vi.fn();
    const unsubscribe = useConvoStore.subscribe(storeWrites);
    wait(SPEAKER_STUCK_MS * 2);
    unsubscribe();

    expect(speaker()).toBeNull();
    expect(storeWrites).not.toHaveBeenCalled();
  });

  it("forgets the clock on unmount", async () => {
    const { vapi, unmount } = await mountSession();
    emit(vapi, "message", speech("assistant", "started"));

    unmount();

    expect(vapi.listenerCount("volume-level")).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe("loudness readings (wired from Vapi)", () => {
  const renderCount = { current: 0 };

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

    renderCount.current = 0;
    const view = renderHook(
      () => {
        renderCount.current += 1;
        return useConvoSession({ assistantId: "a1", userId: "u1" });
      },
      { wrapper },
    );
    await waitFor(() => expect(vapi.listenerCount("volume-level")).toBe(1));

    return { vapi, ...view };
  }

  it("publishes the microphone's loudness for the user and nobody else", async () => {
    const { vapi } = await mountSession();
    const user = vi.fn();
    const assistant = vi.fn();
    const offUser = subscribeVoiceLevel("user", user);
    const offAssistant = subscribeVoiceLevel("assistant", assistant);

    act(() => {
      vapi.emit("local-volume-level", 0.2);
    });

    expect(user).toHaveBeenCalledTimes(1);
    expect(user.mock.calls[0][0]).toBeGreaterThan(0.5);
    expect(assistant).not.toHaveBeenCalled();

    offUser();
    offAssistant();
  });

  it("publishes the companion's loudness for the companion and nobody else", async () => {
    const { vapi } = await mountSession();
    const user = vi.fn();
    const assistant = vi.fn();
    const offUser = subscribeVoiceLevel("user", user);
    const offAssistant = subscribeVoiceLevel("assistant", assistant);

    act(() => {
      vapi.emit("volume-level", 0.6);
    });

    expect(assistant).toHaveBeenCalledTimes(1);
    expect(assistant.mock.calls[0][0]).toBeGreaterThan(0.5);
    expect(user).not.toHaveBeenCalled();

    offUser();
    offAssistant();
  });

  it("publishes a level between 0 and 1 even for wild readings", async () => {
    const { vapi } = await mountSession();
    const user = vi.fn();
    const off = subscribeVoiceLevel("user", user);

    act(() => {
      for (const reading of [0, 5, -1, Number.NaN, 0.1]) {
        vapi.emit("local-volume-level", reading);
      }
    });

    for (const [level] of user.mock.calls) {
      expect(level).toBeGreaterThanOrEqual(0);
      expect(level).toBeLessThanOrEqual(1);
    }
    off();
  });

  it("does not re-render the session hook for loudness readings", async () => {
    const { vapi } = await mountSession();
    const rendersBefore = renderCount.current;

    act(() => {
      for (let i = 0; i < 50; i++) {
        vapi.emit("local-volume-level", 0.2);
        vapi.emit("volume-level", 0.4);
      }
    });

    expect(renderCount.current).toBe(rendersBefore);
  });

  it("stops publishing after unmount", async () => {
    const { vapi, unmount } = await mountSession();
    const user = vi.fn();
    const off = subscribeVoiceLevel("user", user);

    unmount();
    act(() => {
      vapi.emit("local-volume-level", 0.5);
    });

    expect(user).not.toHaveBeenCalled();
    off();
  });
});