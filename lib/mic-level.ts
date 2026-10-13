/**
 * Reads loudness straight from a microphone MediaStreamTrack.
 *
 * Daily's `local-audio-level` observer never fired in this browser (the
 * companion's remote observer did). This is the fallback: a Web Audio
 * analyser on the same track the call is already using. It does not ask
 * for a second microphone permission.
 */

const SAMPLE_MS = 100;

/**
 * Typical speech RMS sits around 0.02–0.1. Dividing by this maps that
 * range onto 0–1, matching Vapi's `local-volume-level` scale closely
 * enough for the speaking ring.
 */
const FULL_SCALE_RMS = 0.08;

export function rmsFromSamples(samples: ArrayLike<number>): number {
  if (samples.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    const s = samples[i];
    sum += s * s;
  }
  return Math.sqrt(sum / samples.length);
}

export function levelFromRms(rms: number): number {
  if (!Number.isFinite(rms) || rms <= 0) return 0;
  return Math.min(1, rms / FULL_SCALE_RMS);
}

export type MicLevelMonitor = {
  /** Watch this track. Replaces any track already being watched. */
  attach: (track: MediaStreamTrack) => void;
  detach: () => void;
};

export function createMicLevelMonitor(
  onLevel: (level: number) => void,
): MicLevelMonitor {
  let audioContext: AudioContext | null = null;
  let source: MediaStreamAudioSourceNode | null = null;
  let analyser: AnalyserNode | null = null;
  let timer: ReturnType<typeof setInterval> | null = null;
  let samples: Float32Array<ArrayBuffer> | null = null;

  const stopTimer = () => {
    if (timer === null) return;
    clearInterval(timer);
    timer = null;
  };

  const detach = () => {
    stopTimer();
    try {
      source?.disconnect();
    } catch {
      /* already disconnected */
    }
    source = null;
    analyser = null;
    samples = null;
    if (audioContext) {
      void audioContext.close().catch(() => {});
      audioContext = null;
    }
  };

  return {
    attach(track) {
      detach();
      if (track.kind !== "audio" || track.readyState === "ended") return;

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;

      audioContext = new AudioCtx();
      if (audioContext.state === "suspended") {
        void audioContext.resume().catch(() => {});
      }

      const stream = new MediaStream([track]);
      source = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.2;
      source.connect(analyser);
      samples = new Float32Array(new ArrayBuffer(analyser.fftSize * 4));

      timer = setInterval(() => {
        if (!analyser || !samples) return;
        analyser.getFloatTimeDomainData(samples);
        onLevel(levelFromRms(rmsFromSamples(samples)));
      }, SAMPLE_MS);
    },
    detach,
  };
}

/** The local participant's live microphone track, if Daily has one. */
export function localAudioTrack(daily: unknown): MediaStreamTrack | null {
  if (!daily || typeof daily !== "object") return null;
  const call = daily as {
    participants?: () => {
      local?: {
        tracks?: {
          audio?: { persistentTrack?: MediaStreamTrack; track?: MediaStreamTrack };
        };
      };
    };
  };
  const audio = call.participants?.()?.local?.tracks?.audio;
  const track = audio?.persistentTrack ?? audio?.track;
  if (!track || typeof track !== "object") return null;
  return (track as MediaStreamTrack).kind === "audio"
    ? (track as MediaStreamTrack)
    : null;
}
