import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Convo from "@/components/ui/convo";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 mt-25 relative overflow-y-auto h-screen md:h-[90vh]">
      <Convo id={id} />
    </main>
  );
}
