import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import NewCompanionGate from "@/components/ui/NewTabForm/NewCompanionGate";

export const metadata: Metadata = {
  title: "Create New Companion – Stanect AI",
  description: "Create a new AI voice companion.",
  robots: { index: false, follow: true },
};

export default async function Page() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  return <NewCompanionGate userId={userId} />;
}
