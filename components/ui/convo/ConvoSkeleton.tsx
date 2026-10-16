import { Pulse } from "../Pulse";
import { CONVO_GLOBE_SIZE, CONVO_GLOBE_STAGE } from "./convo-layout";
import { TranscriptLinesSkeleton } from "./TranscriptLinesSkeleton";

export function ConvoRouteLoading() {
  return (
    <div
      className="relative flex h-full min-h-0 w-full flex-1 flex-col"
      role="status"
      aria-label="Loading conversation"
    >
      <div className="relative grid h-full min-h-0 w-full flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)] overflow-hidden text-white md:rounded-3xl md:border md:border-white/10 md:bg-white/5 md:shadow-2xl md:backdrop-blur-xl lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="relative z-10 flex h-full min-h-0 w-full flex-col items-center overflow-hidden px-2 pt-12 sm:pt-14">
          <div className="absolute top-3 left-3 z-20 sm:top-4 sm:left-4 lg:hidden">
            <Pulse className="size-11 rounded-full border border-white/10 bg-white/8" />
          </div>

          <div className="pointer-events-none absolute top-3 right-24 left-16 z-20 hidden h-9 items-center sm:top-4 sm:right-28 sm:left-[4.5rem] sm:flex lg:left-4">
            <Pulse className="h-3.5 w-28" />
          </div>

          <div className="absolute top-3 left-1/2 z-20 flex h-9 -translate-x-1/2 items-center sm:top-4">
            <Pulse className="h-9 min-w-28 rounded-full border border-white/15 sm:min-w-42" />
          </div>

          <div className="absolute top-3 right-3 z-20 sm:top-4 sm:right-4">
            <Pulse className="h-9 w-16 rounded-md" />
          </div>

          <div className="flex min-h-0 w-full flex-1 flex-col items-center">
            <div className="w-full max-w-lg shrink-0 pb-2 text-center">
              <Pulse className="mx-auto h-7 w-40 sm:h-8 sm:w-48 md:h-9 md:w-56" />
            </div>

            <div className={CONVO_GLOBE_STAGE}>
              <Pulse className="absolute top-1/2 left-0 z-10 size-10 -translate-y-1/2 rounded-full border border-white/25 sm:left-16 sm:size-16 lg:left-2 lg:size-20" />
              <Pulse className="absolute top-1/2 right-0 z-10 size-10 -translate-y-1/2 rounded-full border border-white/25 sm:right-[18px] sm:size-16 lg:size-20" />
              <Pulse className={`${CONVO_GLOBE_SIZE} rounded-full`} />
            </div>
          </div>

          <div className="z-20 flex shrink-0 items-center justify-center gap-3 py-4 sm:gap-6 sm:py-6 lg:py-8">
            <Pulse className="h-11 w-32 rounded-full bg-emerald-400/25 sm:w-48" />
            <Pulse className="size-12 rounded-full lg:hidden" />
          </div>
        </div>

        <div className="hidden h-full min-h-0 border-l border-white/10 lg:block">
          <aside className="flex h-full min-h-0 w-full flex-col border-white/10 bg-white/10 backdrop-blur-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 p-5">
              <div className="flex items-center gap-2">
                <Pulse className="size-[30px] rounded-md" />
                <Pulse className="h-5 w-36 rounded-md" />
              </div>
            </div>
            <div className="min-h-0 flex-1 p-6">
              <TranscriptLinesSkeleton />
            </div>
          </aside>
        </div>
      </div>

      <span className="sr-only">Loading conversation…</span>
    </div>
  );
}
