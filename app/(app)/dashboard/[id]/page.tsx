import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ConvoWrapper from "@/components/ui/ConvoWrapper";
import { Metadata } from "next";
import CheckNecessities from "@/components/ui/CheckNecessities";

export const metadata: Metadata = {
  title: "Conversation – Stanect AI",
  description: "Chat with your AI companion on Stanect.",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) redirect("/login");

  const necessities = await CheckNecessities({ userId });
  if (necessities) return necessities;

  return (
    <div className="min-h-[calc(100vh)] lg:h-[300px] bg-transparent py-16 md:mx-10 xl:mx-40 sm:px-6 mt-5 md:mt-10">
      <ConvoWrapper companionId={id} />
    </div>
  );
}
