"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Skeleton } from "./skeleton";

export default function CreateComponentSkeleton() {
  const themeBg = "bg-gradient-to-br from-[#0b1a36] via-[#1a3a80] to-[#1e4ea8]";
  const skeletonBg = "bg-white/10"; // subtle light against dark theme
  const skeletonPulse = "animate-pulse";

  return (
    <main
      className={`grid grid-cols-1 lg:grid-cols-2 min-h-screen gap-6 p-6 md:p-10 ${themeBg}`}
    >
      {/* LEFT — Avatar Grid */}
      <div className="hidden lg:block">
        <section className="grid grid-cols-4 gap-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-xl ${skeletonBg} ${skeletonPulse} w-full`}
            />
          ))}
        </section>
      </div>

      {/* RIGHT — Form Skeleton */}
      <Card
        className={`${skeletonBg} border border-white/10 rounded-3xl shadow-2xl overflow-hidden`}
      >
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-40 mb-2 rounded-md bg-white/10" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64 rounded-md bg-white/10" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Picker */}
          <div className="flex gap-4 items-center">
            <Skeleton className="h-16 w-16 rounded-full bg-white/10" />
            <Skeleton className="h-16 w-16 rounded-full bg-white/10" />
          </div>

          {/* Input Fields */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32 rounded-md bg-white/10" />
              <Skeleton className="h-12 w-full rounded-lg bg-white/10" />
            </div>
          ))}

          {/* Submit Button */}
          <Skeleton className="h-14 w-full rounded-xl mt-4 bg-white/10" />
        </CardContent>
      </Card>
    </main>
  );
}
