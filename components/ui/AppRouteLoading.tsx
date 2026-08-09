function Pulse({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-full bg-white/10 ${className}`} />
  );
}

export function DashboardRouteLoading() {
  return (
    <div
      className="relative px-4 pt-24 pb-8 sm:px-6 lg:pt-28"
      role="status"
      aria-label="Loading dashboard"
    >
      <div className="mx-auto mb-10 w-full max-w-4xl text-center">
        <Pulse className="mx-auto h-9 w-64 max-w-[85%] rounded-lg sm:h-10 sm:w-80 md:h-11" />
        <Pulse className="mx-auto mt-3 h-4 w-48 max-w-[70%]" />
      </div>

      <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="aspect-square animate-pulse bg-white/10" />
            <div className="space-y-2.5 p-3.5 text-center sm:p-4">
              <Pulse className="mx-auto h-4 w-24 rounded-md" />
              <div className="h-9 w-full animate-pulse rounded-md bg-amber-400/25 md:h-10" />
            </div>
          </div>
        ))}
      </div>

      <span className="sr-only">Loading dashboard…</span>
    </div>
  );
}

export function NewCompanionRouteLoading() {
  return (
    <div
      className="px-4 pt-24 pb-28 lg:pb-16"
      role="status"
      aria-label="Loading companion setup"
    >
      <div className="mx-auto w-full max-w-4xl">
        <div className="mx-auto mb-5 flex min-h-14 w-full max-w-[600px] animate-pulse items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-10 flex-1 rounded-lg bg-white/10" />
          ))}
        </div>

        <Pulse className="mx-auto mb-8 h-8 w-52 rounded-lg" />
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="aspect-square animate-pulse rounded-2xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      </div>

      <span className="sr-only">Loading companion setup…</span>
    </div>
  );
}

export function PricingRouteLoading() {
  return (
    <div
      className="mt-3 min-h-screen bg-transparent px-4 py-25 text-white sm:px-6"
      role="status"
      aria-label="Loading pricing"
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <Pulse className="mx-auto h-10 w-72 max-w-full rounded-lg md:h-14 md:w-[28rem]" />
          <Pulse className="mx-auto mt-4 h-5 w-80 max-w-[90%]" />
          <div className="mx-auto mt-8 h-12 w-56 animate-pulse rounded-full border border-white/10 bg-white/5" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="min-h-[22rem] animate-pulse rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <Pulse className="h-6 w-24 rounded-md" />
              <Pulse className="mt-4 h-10 w-32 rounded-lg" />
              <div className="mt-8 space-y-3">
                <Pulse className="h-4 w-full" />
                <Pulse className="h-4 w-[88%]" />
                <Pulse className="h-4 w-[75%]" />
              </div>
              <div className="mt-10 h-11 w-full animate-pulse rounded-full bg-amber-400/20" />
            </div>
          ))}
        </div>
      </div>

      <span className="sr-only">Loading pricing…</span>
    </div>
  );
}

export function ProfileRouteLoading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center py-12 sm:px-6 md:py-20"
      role="status"
      aria-label="Loading profile"
    >
      <div className="w-full max-w-5xl">
        <div className="mt-5 grid grid-cols-1 overflow-hidden md:grid-cols-2 md:rounded-3xl md:border md:border-white/20 md:bg-white/10 md:shadow-2xl md:backdrop-blur-2xl">
          <div className="relative grid border-b border-gray-700/50 p-8 text-center md:p-10">
            <div className="mx-auto h-28 w-28 animate-pulse rounded-full bg-white/15 md:h-32 md:w-32" />
            <Pulse className="mx-auto mt-6 h-7 w-40 rounded-lg" />
            <Pulse className="mx-auto mt-3 h-5 w-28" />
            <div className="mt-10 flex justify-center gap-4">
              <div className="h-11 w-28 animate-pulse rounded-full bg-white/10" />
              <div className="h-11 w-28 animate-pulse rounded-full bg-amber-400/20" />
            </div>
          </div>

          <div className="space-y-5 p-8 md:p-10">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Pulse className="h-3 w-20" />
                <Pulse className="h-5 w-full max-w-xs rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <span className="sr-only">Loading profile…</span>
    </div>
  );
}

/** Fallback for payment and other app routes */
export default function AppRouteLoading() {
  return (
    <div
      className="flex min-h-[50vh] items-center justify-center py-24"
      role="status"
      aria-label="Loading"
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-orange-500 border-r-amber-400" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
