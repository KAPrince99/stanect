/**
 * Voice loudness for the speaking rings.
 *
 * Loudness changes about ten times a second. Pushing that through React state
 * would re-render the call screen ten times a second, so it never touches
 * React: the hook publishes readings here and the avatar writes them straight
 * into a CSS variable on its own element.
 */

export type VoiceRole = "assistant" | "user";

/**
 * Mic level (0 to 1) at which the user's halo is at full size. Normal speech
 * reads well below 1. A starting value: tune it from a real call.
 */
export const USER_FULL_SCALE_LEVEL = 0.25;

/** Vapi's `volume-level` for the companion is already scaled to 0 to 1. */
export const ASSISTANT_FULL_SCALE_LEVEL = 1;

export type LevelSmoother = {
  /** Take a raw reading, get the smoothed 0 to 1 level to show. */
  next: (raw: number) => number;
  reset: () => void;
};

/**
 * Turns raw readings into a calm 0 to 1 level:
 * - scaled so `fullScale` counts as 1,
 * - square-rooted so quiet speech is still visible,
 * - quick to rise and slower to fall, so it swells with the voice instead of
 *   flickering.
 */
export function createLevelSmoother(
  fullScale: number,
  { attack = 0.7, release = 0.25 }: { attack?: number; release?: number } = {},
): LevelSmoother {
  let value = 0;

  return {
    next(raw) {
      const scaled = Number.isFinite(raw) ? raw / fullScale : 0;
      const target = Math.sqrt(Math.min(1, Math.max(0, scaled)));
      value += (target - value) * (target > value ? attack : release);
      return value;
    },
    reset() {
      value = 0;
    },
  };
}

type LevelListener = (level: number) => void;

const listeners: Record<VoiceRole, Set<LevelListener>> = {
  assistant: new Set(),
  user: new Set(),
};

export function publishVoiceLevel(role: VoiceRole, level: number) {
  for (const listener of listeners[role]) listener(level);
}

/** Returns the unsubscribe function. */
export function subscribeVoiceLevel(
  role: VoiceRole,
  listener: LevelListener,
): () => void {
  listeners[role].add(listener);
  return () => {
    listeners[role].delete(listener);
  };
}
