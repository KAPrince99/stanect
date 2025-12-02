import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ConvoWrapper from "@/components/ui/ConvoWrapper";

interface PageProps {
  params: { id: string };
}

// Server Component: Handles auth and initial data fetching (via ConvoWrapper/Convo)
export default async function Page({ params }: PageProps) {
  const userId = await auth();
  const { id } = await params;
  if (!userId) {
    // Redirect unauthenticated users
    redirect("/login");
  }

  // The conversation component is mounted directly below
  return (
    <div className="min-h-[calc(100vh)] bg-transparent">
      <ConvoWrapper companionId={id} />
    </div>
  );
}
