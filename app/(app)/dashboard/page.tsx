import CompanionCardSkeleton from "@/components/ui/companionCardSkeleton";
import CompanionList from "@/components/ui/companionList";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";

export default async function Dashboard() {
  const { userId } = await auth();

  return (
    <Suspense fallback={<CompanionCardSkeleton />}>
      <CompanionList userId={userId!} />
    </Suspense>
  );
}
