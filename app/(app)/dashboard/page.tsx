import CompanionList from "@/components/ui/companionList";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { auth } from "@clerk/nextjs/server";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  return (
    <main className="overflow-y-auto mb-20 md:mb-15">
      <Suspense fallback={<LoadingSpinner />}>
        <CompanionList userId={userId!} />
      </Suspense>
    </main>
  );
}
