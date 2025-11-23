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
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Convo id={id} />
    </main>
  );
}
