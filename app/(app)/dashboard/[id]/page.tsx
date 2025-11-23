import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Convo from "@/components/ui/convo";
import { getSingleCompanion } from "../../actions/actions";
import ConvoSkeleton from "@/components/ui/convoSkeleton";
import { CompanionProps } from "@/types/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const imageUrl = user?.imageUrl ?? "/avatar-placeholder.png";
  const firstName = user?.firstName ?? "User";
  if (!user) redirect("/sign-in");

  const [companionData] = await Promise.all([getSingleCompanion(id)]);

  if (!companionData) {
    return <ConvoSkeleton />;
  }

  // Casting fetched data to the correct type for safety
  const companion: CompanionProps = companionData;

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Convo companion={companion} imageUrl={imageUrl} firstName={firstName} />
    </main>
  );
}
