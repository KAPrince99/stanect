import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import ConvoAccessGate from "@/components/ui/convo/ConvoAccessGate";
import ConvoWrapper from "@/components/ui/convo/ConvoWrapper";

export const metadata: Metadata = {
  title: "Conversation – Stanect AI",
  description: "Chat with your AI companion on Stanect.",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function Page({ params }: PageProps) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) redirect("/login");

  return (
    <div className="mt-5 min-h-[calc(100vh)] bg-transparent py-16 sm:px-6 md:mx-10 md:mt-10 lg:h-[300px] xl:mx-40">
      <ConvoAccessGate userId={userId}>
        <ConvoWrapper companionId={id} />
      </ConvoAccessGate>
    </div>
  );
}
