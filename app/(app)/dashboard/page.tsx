// app/dashboard/page.tsx
import CompanionCardSkeleton from "@/components/ui/companionCardSkeleton";
import CompanionList from "@/components/ui/companionList";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Suspense } from "react";

export default async function Dashboard() {
  const { userId } = await auth();

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0b1a36] via-[#1a3a80] to-[#1e4ea8] overflow-hidden rounded-xl">
      <Suspense fallback={<CompanionCardSkeleton />}>
        <CompanionList userId={userId!} />
      </Suspense>
    </main>
  );
}
