import CompanionList from "@/components/ui/companionList";
import { auth } from "@clerk/nextjs/server";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/");

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
