import { act, render, screen } from "@testing-library/react";
import { Profiler } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ConvoStatusHero from "@/components/ui/convo/ConvoStatusHero";
import { ConvoStageProvider } from "@/components/ui/convo/ConvoStageContext";
import { publishVoiceLevel } from "@/lib/voice-level";
import { useConvoStore } from "@/store/use-convo-store";

import { useGlobeRuntime } from "@/components/ui/GlobeRuntime";

import { convoStage, resetConvoStore } from "../support/convo";

vi.mock("@/components/ui/GlobeCanvas", () => ({
  default: () => null,
}));

function renderHero(overrides: Parameters<typeof convoStage>[0] = {}) {
  return render(
    <ConvoStageProvider
      value={convoStage({
        companionAvatarUrl: "/avatars/mia.jpg",
        userAvatarUrl: "/avatars/ada.jpg",
        ...overrides,
      })}
    >
      <ConvoStatusHero />
    </ConvoStageProvider>,
  );
}

/** The positioned wrapper around a portrait, found from its image. */
function portrait(alt: string) {
  const wrapper = screen.getByAltText(alt).parentElement?.parentElement;
  if (!wrapper) throw new Error(`No portrait wrapper for "${alt}"`);
  return wrapper;
}

const companion = () => portrait("Mia");
const user = () => portrait("Your profile picture");
/** The expanding bubble rings (not the loudness halo). */
const rings = (el: HTMLElement) =>
  el.querySelectorAll(".animate-speaking-pulse");
/** Every purely decorative element drawn around a portrait. */
const decorations = (el: HTMLElement) => el.querySelectorAll("[aria-hidden]");
const avatarRing = (el: HTMLElement) => el.querySelector("div") as HTMLElement;

function setSpeaker(speaker: "assistant" | "user" | null) {
  act(() => {
    useConvoStore.setState({ speaker });
  });
}

beforeEach(() => {
  resetConvoStore();
  useGlobeRuntime.getState().reset();
  useConvoStore.setState({ callStatus: "ACTIVE" });
});

afterEach(() => {
  useGlobeRuntime.getState().reset();
});

describe("speaking ring on the avatars", () => {
  it("shows both avatars calm when nobody is speaking", () => {
    renderHero();

    for (const el of [companion(), user()]) {
      expect(el).toHaveAttribute("data-speaking", "false");
      expect(rings(el)).toHaveLength(0);
      expect(decorations(el)).toHaveLength(0);
      expect(avatarRing(el)).toHaveClass("border-white/25");
      expect(avatarRing(el)).not.toHaveClass("border-brand-accent");
    }
  });

  it("lights up the companion's avatar, and only hers, while she speaks", () => {
    renderHero();
    setSpeaker("assistant");

    expect(companion()).toHaveAttribute("data-speaking", "true");
    expect(avatarRing(companion())).toHaveClass("border-brand-accent");
    expect(rings(companion())).toHaveLength(2);

    expect(user()).toHaveAttribute("data-speaking", "false");
    expect(rings(user())).toHaveLength(0);
  });

  it("lights up the user's avatar, and only theirs, while they speak", () => {
    renderHero();
    setSpeaker("user");

    expect(user()).toHaveAttribute("data-speaking", "true");
    expect(avatarRing(user())).toHaveClass("border-brand-accent");
    expect(rings(user())).toHaveLength(2);

    expect(companion()).toHaveAttribute("data-speaking", "false");
    expect(rings(companion())).toHaveLength(0);
  });

  it("follows the conversation back and forth and goes calm again at the end", () => {
    renderHero();

    setSpeaker("assistant");
    expect(companion()).toHaveAttribute("data-speaking", "true");

    setSpeaker("user");
    expect(companion()).toHaveAttribute("data-speaking", "false");
    expect(user()).toHaveAttribute("data-speaking", "true");

    setSpeaker(null);
    expect(companion()).toHaveAttribute("data-speaking", "false");
    expect(user()).toHaveAttribute("data-speaking", "false");
  });

  it("goes calm when the call ends while someone is speaking", () => {
    renderHero();
    setSpeaker("assistant");
    expect(companion()).toHaveAttribute("data-speaking", "true");

    act(() => {
      useConvoStore.getState().setCallStatus("INACTIVE");
    });

    expect(companion()).toHaveAttribute("data-speaking", "false");
    expect(rings(companion())).toHaveLength(0);
  });

  it("drops the pulsing rings for reduced motion but keeps the static orange border", () => {
    renderHero();
    setSpeaker("assistant");

    for (const ring of rings(companion())) {
      expect(ring).toHaveClass("motion-reduce:hidden");
    }
    expect(avatarRing(companion())).toHaveClass(
      "border-brand-accent",
      "ring-brand-accent/40",
    );
  });

  it("uses a smaller pulse on phones, where the avatar sits at the screen edge", () => {
    renderHero();
    setSpeaker("user");

    for (const ring of rings(user())) {
      expect(ring).toHaveClass(
        "[--speaking-scale:1.25]",
        "sm:[--speaking-scale:1.4]",
      );
    }
  });

  it("hides the pulse rings from screen readers", () => {
    renderHero();
    setSpeaker("user");

    // Bubble rings and the loudness halo: all of it is decoration.
    expect(decorations(user())).toHaveLength(3);
    for (const decoration of decorations(user())) {
      expect(decoration).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("only draws the avatars that exist", () => {
    renderHero({ userAvatarUrl: null });
    setSpeaker("user");

    expect(screen.queryByAltText("Your profile picture")).not.toBeInTheDocument();
    expect(companion()).toHaveAttribute("data-speaking", "false");
  });
});

describe("loudness halo on the avatars", () => {
  const halo = (el: HTMLElement) =>
    el.querySelector<HTMLElement>(".speaking-halo");
  const level = (el: HTMLElement) => el.style.getPropertyValue("--voice-level");
  const publish = (role: "assistant" | "user", value: number) =>
    act(() => publishVoiceLevel(role, value));

  it("has no halo while nobody is speaking", () => {
    renderHero();

    expect(halo(companion())).toBeNull();
    expect(halo(user())).toBeNull();
  });

  it("shows a halo on the speaker, and only on the speaker", () => {
    renderHero();
    setSpeaker("assistant");

    expect(halo(companion())).not.toBeNull();
    expect(halo(user())).toBeNull();
  });

  it("starts the halo at rest each time someone starts speaking", () => {
    renderHero();
    setSpeaker("user");

    expect(level(user())).toBe("0");
  });

  it("makes the halo follow the loudness of the speaker's own voice", () => {
    renderHero();
    setSpeaker("assistant");

    publish("assistant", 0.4);
    expect(level(companion())).toBe("0.40");

    publish("assistant", 0.9);
    expect(level(companion())).toBe("0.90");
  });

  it("does not let one side's loudness move the other side's halo", () => {
    renderHero();
    setSpeaker("user");

    publish("assistant", 0.8);

    expect(level(user())).toBe("0");

    publish("user", 0.5);
    expect(level(user())).toBe("0.50");
  });

  it("goes back to rest and stops listening when the speaker stops", () => {
    renderHero();
    setSpeaker("user");
    publish("user", 0.7);

    setSpeaker(null);
    expect(level(user())).toBe("0");

    publish("user", 0.9);
    expect(level(user())).toBe("0");
  });

  it("starts from rest again when the same person speaks a second time", () => {
    renderHero();
    setSpeaker("user");
    publish("user", 0.9);
    setSpeaker(null);

    setSpeaker("user");

    expect(level(user())).toBe("0");
  });

  it("hides the halo for reduced motion and keeps it smaller on phones", () => {
    renderHero();
    setSpeaker("user");

    expect(halo(user())).toHaveClass(
      "motion-reduce:hidden",
      "[--halo-gain:0.2]",
      "sm:[--halo-gain:0.3]",
    );
    expect(halo(user())).toHaveAttribute("aria-hidden", "true");
  });

  it("never re-renders the call screen for loudness readings", () => {
    const onRender = vi.fn();
    render(
      <Profiler id="hero" onRender={onRender}>
        <ConvoStageProvider
          value={convoStage({
            companionAvatarUrl: "/avatars/mia.jpg",
            userAvatarUrl: "/avatars/ada.jpg",
          })}
        >
          <ConvoStatusHero />
        </ConvoStageProvider>
      </Profiler>,
    );
    setSpeaker("assistant");
    onRender.mockClear();

    for (let i = 0; i < 100; i++) publish("assistant", (i % 10) / 10);

    expect(onRender).not.toHaveBeenCalled();
  });
});