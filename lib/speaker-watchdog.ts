/**
 * Safety net for the speaking rings. Vapi tells us when someone *stops*
 * speaking, but if that one message is ever lost the ring would glow forever.
 *
 * This is not a "max speaking time": a long answer is perfectly legitimate.
 * The ring is only cleared after a stretch with NO sign of life from whoever
 * holds it (their audio level or their live transcript). Every sign of life
 * restarts the clock.
 */

/** How long a ring may go without any sign of life before it is cleared. */
export const SPEAKER_STUCK_MS = 5000;

/**
 * Vapi's `volume-level` (the companion's audio) at or above this means her
 * voice is really playing. Matches the SDK's own "is speaking" cutoff.
 */
export const REMOTE_AUDIO_ACTIVE_LEVEL = 0.05;

export type SpeakerWatchdog = {
  /** Someone holds the ring, or showed a sign of life: (re)start the clock. */
  touch: () => void;
  /** Nobody holds the ring any more. */
  cancel: () => void;
};

export function createSpeakerWatchdog(
  onStuck: () => void,
  ms: number = SPEAKER_STUCK_MS,
): SpeakerWatchdog {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const cancel = () => {
    if (timer === null) return;
    clearTimeout(timer);
    timer = null;
  };

  return {
    touch() {
      cancel();
      timer = setTimeout(() => {
        timer = null;
        onStuck();
      }, ms);
    },
    cancel,
  };
}

/** Who a live transcript message (partial or final) belongs to, if it is one. */
export function transcriptRole(message: unknown): "assistant" | "user" | null {
  if (typeof message !== "object" || message === null) return null;

  const { type, role } = message as Record<string, unknown>;
  const isTranscript =
    type === "transcript" || type === "transcript[transcriptType='final']";

  if (!isTranscript) return null;
  return role === "assistant" || role === "user" ? role : null;
}
