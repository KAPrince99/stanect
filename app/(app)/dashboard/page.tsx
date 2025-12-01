// app/dashboard/page.tsx
import CompanionCardSkeleton from "@/components/ui/companionCardSkeleton";
import CompanionList from "@/components/ui/companionList";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Suspense } from "react";

export default async function Dashboard() {
  const { userId } = await auth();

  return (
    <main className="min-h-screen bg-transparent rounded-xl">
      <Suspense fallback={<CompanionCardSkeleton />}>
        <CompanionList userId={userId!} />
      </Suspense>
    </main>
  );
}
