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
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 ml-0 md:ml-30 min-h-screen">
      <Convo id={id} />
    </main>
  );
}
