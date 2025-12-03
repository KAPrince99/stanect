"use client";

// Skeleton with shimmer animation
export default function ConvoSkeleton() {
  return (
    <div className="flex flex-col md:flex-row h-[80vh] bg-white/10 text-white w-full rounded-xl overflow-hidden shadow-xl">
      {/* LEFT SIDE */}
      <div className="flex flex-col flex-1 p-4 md:p-8 space-y-6 overflow-y-auto scrollbar-hide">
        {/* HEADER SKELETON */}
        <div className="flex justify-center items-center pt-2 text-center space-y-2">
          <div className="h-4 w-28 rounded bg-white/10 animate-shimmer" />
          <div className="h-8 w-40 rounded-md bg-white/10 animate-shimmer" />
        </div>

        {/* VIDEOS SKELETON */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full aspect-square rounded-2xl bg-white/10 animate-shimmer" />
          <div className="hidden md:block w-full aspect-square rounded-2xl bg-white/10 animate-shimmer" />
        </div>

        {/* CONTROLS SKELETON */}
        <div className="flex justify-center pt-4">
          <div className="flex justify-between items-center w-full max-w-md gap-6">
            <div className="w-16 h-16 rounded-full bg-white/10 animate-shimmer" />
            <div className="w-20 h-20 rounded-full bg-white/10 animate-shimmer" />
            <div className="w-16 h-16 rounded-full bg-white/10 animate-shimmer" />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE — Transcript */}
      <aside className="w-full md:w-1/3 bg-white/10 border-l border-stone-400 p-6 overflow-y-auto scrollbar-hide hidden md:flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-stone-400">
          <div className="h-6 w-32 rounded bg-white/10 animate-shimmer" />
          <div className="h-8 w-8 rounded-md bg-white/10 animate-shimmer" />
        </div>

        {/* Transcript entries */}
        <div className="flex-1 space-y-6 mt-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 rounded bg-white/10 animate-shimmer" />
              <div className="h-4 w-full rounded bg-white/10 animate-shimmer" />
              <div className="h-4 w-3/4 rounded bg-white/10 animate-shimmer" />
            </div>
          ))}
        </div>
      </aside>

      {/* Tailwind shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
}
