import CreateCompanion from "@/components/ui/createCompanion";
import CreateComponentSkeleton from "@/components/ui/createComponentSkeleton";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default async function page() {
  return (
    <main className="py-20 px-2 md:px-6 lg:px-8 bg-transparent min-h-screen">
      <Suspense
        fallback={
          <div className="flex justify-center items-center my-50">
            <Loader2 className="animate-spin" />
          </div>
        }
      >
        <CreateCompanion />
      </Suspense>
    </main>
  );
}
