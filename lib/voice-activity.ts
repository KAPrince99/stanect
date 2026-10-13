/**
 * Detects "the user is talking" from the microphone level alone, so the user's
 * speaking ring reacts right away instead of waiting for Vapi's server to
 * transcribe and report it (that round trip takes one to two seconds).
 *
 * The levels are 0 to 1 (Vapi's `local-volume-level`, every 100ms). They are
 * starting values: tune them from a real call.
 */
export const VOICE_ACTIVITY = {
  /** Level that counts as the user starting to talk. */
  onLevel: 0.04,
  /** Once talking, anything at or above this keeps it going (hysteresis). */
  offLevel: 0.02,
  /**
   * Higher bar for *starting* while the companion is talking, so her voice
   * leaking from the speakers into the mic does not light up the user's ring.
   */
  onLevelWhileAssistant: 0.12,
  /** How long the level must stay quiet before the user counts as done. */
  holdMs: 400,
} as const;

export type VoiceActivityOptions = typeof VOICE_ACTIVITY;

export type VoiceActivityDetector = {
  /** Feed one mic level reading. */
  push: (level: number, opts?: { assistantSpeaking?: boolean }) => void;
  /** Stop right now (mute, call over). Reports "not talking" if it was. */
  reset: () => void;
  /** Cancel any pending timer without reporting anything. */
  dispose: () => void;
};

export function createVoiceActivityDetector(
  onChange: (active: boolean) => void,
  options: VoiceActivityOptions = VOICE_ACTIVITY,
): VoiceActivityDetector {
  let active = false;
  let quietTimer: ReturnType<typeof setTimeout> | null = null;

  const clearQuietTimer = () => {
    if (quietTimer === null) return;
    clearTimeout(quietTimer);
    quietTimer = null;
  };

  return {
    push(level, { assistantSpeaking = false } = {}) {
      if (!Number.isFinite(level)) return;

      const threshold = active
        ? options.offLevel
        : assistantSpeaking
          ? options.onLevelWhileAssistant
          : options.onLevel;

      if (level >= threshold) {
        clearQuietTimer();
        if (!active) {
          active = true;
          onChange(true);
        }
        return;
      }

      // Quiet. A timer (not "the next reading") ends it, so it still ends
      // when readings stop arriving.
      if (active && quietTimer === null) {
        quietTimer = setTimeout(() => {
          quietTimer = null;
          active = false;
          onChange(false);
        }, options.holdMs);
      }
    },

    reset() {
      clearQuietTimer();
      if (!active) return;
      active = false;
      onChange(false);
    },

    dispose() {
      clearQuietTimer();
    },
  };
}
