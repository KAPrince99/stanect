import { Pulse } from "../Pulse";
import { AVATAR_PICKER_GRID } from "./avatar-layout";

const AVATAR_SLOT_COUNT = 8;

export function AvatarSkeleton({
  announce = true,
  showNav = false,
}: {
  announce?: boolean;
  showNav?: boolean;
}) {
  return (
    <div
      role={announce ? "status" : undefined}
      aria-label={announce ? "Loading avatars" : undefined}
    >
      <div className="my-6 flex items-center justify-center">
        <Pulse className="h-8 w-56 sm:h-9 sm:w-64" />
      </div>

      <div className={AVATAR_PICKER_GRID}>
        {Array.from({ length: AVATAR_SLOT_COUNT }).map((_, index) => (
          <Pulse
            key={index}
            className="aspect-square rounded-3xl border border-white/20"
          />
        ))}
      </div>

      {showNav ? (
        <div className="my-6 flex justify-end gap-3 sm:my-8">
          <Pulse className="size-11 rounded-full border border-white/10 bg-white/8" />
          <Pulse className="size-11 rounded-full border border-white/10 bg-white/8" />
        </div>
      ) : null}

      {announce ? <span className="sr-only">Loading avatars…</span> : null}
    </div>
  );
}
