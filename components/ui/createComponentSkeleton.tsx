import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Skeleton } from "./skeleton";

export default function CreateComponentSkeleton() {
  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 gap-1 sm:gap-7 xl:gap-1 min-h-screen ">
      <div className="hidden lg:block">
        <section className="bg-stone-100 grid grid-cols-4 gap-2">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="
              relative aspect-square w-30 overflow-hidden rounded-md
              border-6 border-transparent animate-pulse
            "
            >
              <div className="w-full h-full bg-stone-300" />
            </div>
          ))}
        </section>
      </div>
      <main>
        <Card className="bg-stone-100">
          <CardHeader>
            <CardTitle className="text-2xl">
              <Skeleton className="h-6 w-40  bg-stone-300" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-64 mt-2  bg-stone-300" />
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Mobile Avatar Picker */}
            <div className="lg:hidden mt-4 mb-4">
              <Skeleton className="h-4 w-16 mb-3  bg-stone-300" />

              <div className="flex gap-2 items-center">
                <Skeleton className="h-12 w-12 rounded-md bg-stone-300" />
                <Skeleton className="h-10 w-10 rounded-full bg-stone-300" />
              </div>
            </div>

            {/* Companion Name */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32  bg-stone-300" />
              <Skeleton className="h-10 w-full rounded-md bg-stone-300" />
            </div>

            {/* Venue */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20  bg-stone-300" />
              <Skeleton className="h-10 w-full rounded-md bg-stone-300" />
            </div>

            {/* Voice */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20  bg-stone-300" />
              <Skeleton className="h-10 w-full rounded-md bg-stone-300" />
            </div>

            {/* Style */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20  bg-stone-300" />
              <Skeleton className="h-10 w-full rounded-md bg-stone-300" />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-60  bg-stone-300" />
              <Skeleton className="h-10 w-full rounded-md bg-stone-300" />
            </div>

            {/* Button */}
            <Skeleton className="h-12 w-full rounded-md bg-stone-300" />
          </CardContent>
        </Card>
      </main>
    </main>
  );
}
