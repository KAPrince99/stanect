import CompanionList from "@/components/ui/companionList";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { auth } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";
import { Suspense } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard – Stanect AI",
  description: "Your personal dashboard to manage Stanect AI companions.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  return (
    <main className="overflow-y-auto mb-30 md:mb-15">
      <Suspense fallback={<LoadingSpinner />}>
        <CompanionList userId={userId!} />
      </Suspense>
    </main>
  );
}
