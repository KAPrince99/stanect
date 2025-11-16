import CompanionList from "@/components/ui/companionList";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/login");
  return (
    <main
      className="
    mt-16
    px-4 sm:px-6 md:px-10
    grid
    grid-cols-1
    sm:grid-cols-2
    md:grid-cols-3
    lg:grid-cols-4
    gap-4 md:gap-5 lg:gap-6
    
  "
    >
      <CompanionList userId={userId} />
    </main>
  );
}
