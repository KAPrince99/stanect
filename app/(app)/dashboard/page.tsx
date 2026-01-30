import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getCompanions } from "@/app/(app)/actions/actions";
import CompanionList from "@/components/ui/companionList";

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
        <CompanionList userId={userId} />
      </HydrationBoundary>
    </main>
  );
}
