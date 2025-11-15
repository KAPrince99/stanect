import CreateCompanion from "@/components/ui/createCompanion";
import { Suspense } from "react";

export default function page() {
  return (
    <main className="min-h-screen py-20">
      <div className="px-2 md:px-6 lg:px-8 ">
        <Suspense fallback={<div>Loading...</div>}>
          <CreateCompanion />
        </Suspense>
      </div>
    </main>
  );
}
