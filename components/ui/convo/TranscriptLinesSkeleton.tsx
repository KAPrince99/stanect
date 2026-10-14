import { Pulse } from "../Pulse";

const TRANSCRIPT_GHOSTS = [
  { side: "start", width: "w-[72%]", height: "h-16" },
  { side: "end", width: "w-[58%]", height: "h-14" },
  { side: "start", width: "w-[64%]", height: "h-16" },
  { side: "end", width: "w-[48%]", height: "h-12" },
] as const;

export function TranscriptLinesSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading transcript"
      className="space-y-3 pt-1"
    >
      {TRANSCRIPT_GHOSTS.map((ghost, index) => (
        <div
          key={index}
          className={`flex ${ghost.side === "end" ? "justify-end" : "justify-start"}`}
        >
          <Pulse
            className={`${ghost.height} ${ghost.width} max-w-[85%] rounded-2xl ${
              ghost.side === "end" ? "rounded-br-none" : "rounded-tl-none"
            }`}
          />
        </div>
      ))}
      <span className="sr-only">Loading transcript…</span>
    </div>
  );
}
