import CreateCompanion from "@/components/ui/createCompanion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createSupabaseClient } from "@/lib/supabase";
import UpgradeAlert from "@/components/ui/upgradeAlert";
import { hasReachedCompanionLimit, getMaxCompanions } from "@/lib/plan-utils";
import type { PlanType } from "@/lib/plan-limits";

export const metadata: Metadata = {
  title: "Create New Companion – Stanect AI",
  description: "Create a new AI voice companion.",
  robots: { index: false, follow: true },
};

export default async function Page() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const supabase = createSupabaseClient();

  const { data: userData } = await supabase
    .from("users")
    .select("plan")
    .eq("clerk_user_id", userId)
    .single();

  const { count } = await supabase
    .from("companions")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", userId);

  const plan = (userData?.plan || "free") as PlanType;
  const maxAllowed = getMaxCompanions(plan);

  if (count !== null && hasReachedCompanionLimit(count, plan)) {
    return <UpgradeAlert plan={plan} maxAllowed={maxAllowed} />;
  }

  return (
    <main className="py-20 px-2 md:px-6 lg:px-8 bg-transparent min-h-screen mb-30 md:mb-15">
      <Suspense fallback={<LoadingSpinner />}>
        <CreateCompanion />
      </Suspense>
    </main>
  );
}
