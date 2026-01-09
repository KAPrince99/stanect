import CreateCompanion from "@/components/ui/createCompanion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Suspense } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create New Companion – Stanect AI",
  description:
    "Create a new AI voice companion to practice conversations and improve communication skills.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function page() {
  return (
    <main className="py-20 px-2 md:px-6 lg:px-8 bg-transparent min-h-screen mb-30 md:mb-15">
      <Suspense fallback={<LoadingSpinner />}>
        <CreateCompanion />
      </Suspense>
    </main>
  );
}
