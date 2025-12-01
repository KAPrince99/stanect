// app/(app)/dashboard/[id]/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ConvoWrapper from "@/components/ui/ConvoWrapper"; // Import the new wrapper

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const { userId } = await auth();
  if (!userId) redirect("/login");

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <ConvoWrapper id={id} />
    </main>
  );
}
