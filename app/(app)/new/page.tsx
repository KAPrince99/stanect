import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getAvatars, getSingleAvatar } from "@/app/(app)/actions/actions";
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

  const queryClient = new QueryClient();
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

  const avatars = await queryClient.fetchQuery({
    queryKey: ["avatars"],
    queryFn: getAvatars,
    staleTime: Infinity,
  });

  const defaultAvatarId = avatars[0]?.id;

  if (defaultAvatarId) {
    await queryClient.prefetchQuery({
      queryKey: ["avatar", defaultAvatarId],
      queryFn: () => getSingleAvatar(defaultAvatarId),
      staleTime: Infinity,
    });
  }

  await queryClient.prefetchQuery({
    queryKey: ["avatar", "default"],
    queryFn: () => getSingleAvatar(defaultAvatarId),
    staleTime: Infinity,
  });

  return (
    <main className="mt-25 mb-30 flex min-h-screen flex-col bg-transparent md:mb-15 md:h-screen">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TabForm userPlan={plan} />
      </HydrationBoundary>
    </main>
  );
}
