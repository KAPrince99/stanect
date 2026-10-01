import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import DashboardCompanionList from "@/components/ui/HomeDashboard/DashboardCompanionList";

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  return (
    <main className="dashboard-dock-pad overflow-y-auto">
      <DashboardCompanionList userId={userId} />
    </main>
  );
}
