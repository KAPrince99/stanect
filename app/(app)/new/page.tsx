import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import TabForm from "@/components/ui/NewTabForm/TabForm";
import UpgradeAlert from "@/components/ui/upgradeAlert";
import type { PlanType } from "@/lib/plan-limits";
import { getMaxCompanions, hasReachedCompanionLimit } from "@/lib/plan-utils";
import { createSupabaseClient } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Create New Companion – Stanect AI",
  description: "Create a new AI voice companion.",
  robots: { index: false, follow: true },
};

export default async function Page() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const supabase = createSupabaseClient();

  const [{ data: userData }, { count }] = await Promise.all([
    supabase
      .from("users")
      .select("plan")
      .eq("clerk_user_id", userId)
      .single(),
    supabase
      .from("companions")
      .select("*", { count: "exact", head: true })
      .eq("owner_id", userId),
  ]);

  const plan = (userData?.plan || "free") as PlanType;
  const maxAllowed = getMaxCompanions(plan);

  if (count !== null && hasReachedCompanionLimit(count, plan)) {
    return <UpgradeAlert plan={plan} maxAllowed={maxAllowed} />;
  }

  return (
    <main className="mt-25 mb-30 flex min-h-screen flex-col bg-transparent md:mb-15 md:h-screen">
      <TabForm userPlan={plan} />
    </main>
  );
}
