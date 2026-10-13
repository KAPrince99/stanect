import { Pulse } from "../Pulse";

interface AuthRouteLoadingProps {
  mode?: "login" | "signup";
}

function ClerkFormGhost() {
  return (
    <div className="flex w-full flex-col">
      <Pulse className="h-7 w-40 rounded-md" />
      <Pulse className="mt-2 h-4 w-52" />

      <Pulse className="mt-6 h-11 w-full rounded-xl bg-white/20" />

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/15" />
        <Pulse className="h-3 w-6" />
        <div className="h-px flex-1 bg-white/15" />
      </div>

      <Pulse className="h-3 w-16" />
      <Pulse className="mt-2 h-10 w-full rounded-xl border border-white/15" />
      <Pulse className="mt-4 h-3 w-20" />
      <Pulse className="mt-2 h-10 w-full rounded-xl border border-white/15" />

      <Pulse className="mt-6 h-10 w-full rounded-xl bg-amber-400/25" />

      <div className="mt-6 flex items-center justify-center gap-2">
        <Pulse className="h-3 w-32" />
        <Pulse className="h-3 w-14" />
      </div>
    </div>
  );
}

export function AuthRouteLoading({ mode = "login" }: AuthRouteLoadingProps) {
  const label = mode === "signup" ? "Loading sign up" : "Loading sign in";

  return (
    <div
      className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/40 backdrop-blur-xl lg:grid-cols-2"
      role="status"
      aria-label={label}
    >
      <aside className="relative hidden flex-col justify-between border-r border-white/10 bg-black/20 p-10 lg:flex xl:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_20%,rgba(232,140,48,0.14),transparent_55%),radial-gradient(ellipse_70%_50%_at_90%_90%,rgba(30,78,168,0.35),transparent_50%)]"
        />

        <Pulse className="relative z-10 h-5 w-24 sm:h-6" />

        <div className="relative z-10 max-w-sm">
          <Pulse className="h-10 w-56 rounded-md xl:h-12 xl:w-64" />
          <Pulse className="mt-4 h-4 w-full" />
          <Pulse className="mt-2 h-4 w-5/6" />
        </div>

        <Pulse className="relative z-10 h-3 w-56" />
      </aside>

      <div className="flex items-center justify-center px-5 py-8 sm:px-8 sm:py-10 md:px-12">
        <div className="flex w-full max-w-[400px] flex-col items-center">
          <div className="mb-8 flex w-full flex-col items-center lg:hidden">
            <Pulse className="h-5 w-24 sm:h-6" />
            <Pulse className="mt-2 h-4 w-32" />
          </div>

          <ClerkFormGhost />
        </div>
      </div>

      <span className="sr-only">{label}…</span>
    </div>
  );
}
