import CompanionCard from "@/components/ui/companionCard";

import { mockData } from "@/mock/data";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/login");
  return (
    <main className="mt-15 px-4 sm:px-6 md:px-10">
      <div
        className="
    grid
    grid-cols
    md:grid-cols-3
    lg:grid-cols-4
    gap-2
    md:gap-4
    sm:gap-6
    place-items-center
  "
      >
        {mockData.map((mock) => (
          <CompanionCard key={mock.name} mock={mock} />
        ))}
      </div>
    </main>
  );
}
