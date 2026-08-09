import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import DashboardCompanionList from "@/components/ui/HomeDashboard/DashboardCompanionList";

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  return (
    <main className="overflow-y-auto pb-28 md:pb-16">
      <DashboardCompanionList userId={userId} />
    </main>
  );
}
