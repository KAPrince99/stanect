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
    <div className="box-border flex h-dvh flex-col px-4 pt-24 pb-28 sm:px-6 md:px-8 md:pb-10 lg:px-10 xl:px-16">
      <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col">
        <ConvoAccessGate userId={userId}>
          <ConvoWrapper companionId={id} />
        </ConvoAccessGate>
      </div>
    </div>
  );
}
