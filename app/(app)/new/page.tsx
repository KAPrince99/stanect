import CreateCompanion from "@/components/ui/createCompanion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createSupabaseClient } from "@/lib/supabase";
import UpgradeAlert from "@/components/ui/upgradeAlert";

export const metadata: Metadata = {
  title: "Create New Companion – Stanect AI",
  description: "Create a new AI voice companion.",
  robots: { index: false, follow: true },
};

export default async function Page() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const supabase = createSupabaseClient();

  // Fetch User Plan & Current Count
  const { data: userData } = await supabase
    .from("users")
    .select("plan")
    .eq("clerk_user_id", userId)
    .single();

  const { count } = await supabase
    .from("companions")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", userId);

  const plan = (userData?.plan || "free") as "free" | "pro" | "king";
  const maxAllowed = plan === "free" ? 1 : plan === "pro" ? 10 : 50;

  // Check if limit is reached
  if (count !== null && count >= maxAllowed) {
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
