import { companionPortraitAspect } from "../HomeDashboard/CompanionOverviewCardMedia";
import { Pulse } from "../Pulse";

export function PreviewSkeleton() {
  return (
    <div className="w-full" role="status" aria-label="Loading preview">
      <div className="mx-auto grid max-w-4xl grid-cols-1 items-center gap-8 px-4 lg:grid-cols-2 lg:gap-12">
        <div className="mx-auto w-full max-w-[320px]">
          <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl">
            <Pulse className={`w-full rounded-none ${companionPortraitAspect}`} />
            <div className="flex flex-1 flex-col p-3 text-center sm:p-4">
              <Pulse className="mx-auto h-5 w-28 rounded-md sm:h-6" />
            </div>
          </article>
        </div>

        <div className="mx-auto w-full max-w-md space-y-10">
          <div className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
            <Pulse className="mx-auto h-7 w-52 sm:h-8" />
            <Pulse className="mx-auto h-4 w-64 max-w-full" />

            <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between gap-3">
                  <Pulse className="h-3 w-16" />
                  <Pulse className="h-4 w-24" />
                </div>
              ))}
            </div>

            <div className="space-y-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between">
                  <Pulse className="h-4 w-28" />
                  <Pulse className="h-4 w-10" />
                </div>
              ))}
            </div>

            <Pulse className="h-12 w-full rounded-full bg-amber-400/25" />
            <Pulse className="mx-auto h-3 w-56 max-w-full" />
          </div>
        </div>
      </div>

      <span className="sr-only">Loading preview…</span>
    </div>
  );
}
