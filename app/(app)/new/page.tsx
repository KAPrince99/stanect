import CreateCompanion from "@/components/ui/createCompanion";
import CreateComponentSkeleton from "@/components/ui/createComponentSkeleton";
import { Suspense } from "react";

export default async function page() {
  return (
    <main className="py-20 px-2 md:px-6 lg:px-8">
      <Suspense fallback={<CreateComponentSkeleton />}>
        <CreateCompanion />
      </Suspense>
    </main>
  );
}
