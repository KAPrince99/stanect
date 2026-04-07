import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getCompanions } from "@/app/(app)/actions/actions";
import DashboardCompanionList from "@/components/ui/HomeDashboard/DashboardCompanionList";

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["companions", userId],
    queryFn: () => getCompanions(userId),
  });

  return (
    <main className="overflow-y-auto mb-30 md:mb-15">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DashboardCompanionList userId={userId} />
      </HydrationBoundary>
    </main>
  );
}
