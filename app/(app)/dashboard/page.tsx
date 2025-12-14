import CompanionCardSkeleton from "@/components/ui/companionCardSkeleton";
import CompanionList from "@/components/ui/companionList";
import { auth } from "@clerk/nextjs/server";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default async function Dashboard() {
  const { userId } = await auth();

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center my-50">
          <Loader2 className="animate-spin" />
        </div>
      }
    >
      <CompanionList userId={userId!} />
    </Suspense>
  );
}
