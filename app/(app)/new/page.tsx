import CreateCompanion from "@/components/ui/createCompanion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Suspense } from "react";

export default async function page() {
  return (
    <main className="py-20 px-2 md:px-6 lg:px-8 bg-transparent min-h-screen">
      <Suspense fallback={<LoadingSpinner />}>
        <CreateCompanion />
      </Suspense>
    </main>
  );
}
