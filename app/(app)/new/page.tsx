import CreateCompanion from "@/components/ui/createCompanion";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";

export default async function page() {
  return (
    <main className="py-20 px-2 md:px-6 lg:px-8">
      <Suspense fallback={<div>Loading...</div>}>
        <CreateCompanion />
      </Suspense>
    </main>
  );
}
