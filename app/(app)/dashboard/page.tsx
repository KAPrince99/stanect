import CompanionCard from "@/components/ui/companionCard";
import MobileDock from "@/components/ui/mobileDock";
import NavPill from "@/components/ui/navPill";
import { mockData } from "@/mock/data";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const icons = [
  { src: "https://cdn.lordicon.com/pgirtdfe.json", id: 1, href: "/dashboard" },
  { src: "https://cdn.lordicon.com/ytklkgsc.json", id: 2, href: "/pricing" },
  { src: "https://cdn.lordicon.com/ueoydrft.json", id: 3, href: "/new" },
];

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/login");
  return (
    <main className="mt-15 px-4 sm:px-6 md:px-10">
      <MobileDock icons={icons} />
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
