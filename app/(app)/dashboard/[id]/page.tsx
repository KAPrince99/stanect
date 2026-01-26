import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ConvoWrapper from "@/components/ui/ConvoWrapper";
import { Metadata } from "next";
import { createSupabaseClient } from "@/lib/supabase";
import { isTrialExpired } from "@/lib/plan-utils"; // The helper we discussed
import ConvoGuard from "@/components/ui/convoGuard";

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

  if (!userId) {
    redirect("/login");
  }

  const supabase = createSupabaseClient();

  const { data: user } = await supabase
    .from("users")
    .select("plan, created_at, daily_seconds_used")
    .eq("clerk_user_id", userId)
    .single();

  const plan = user?.plan || "free";

  if (plan === "free") {
    if (isTrialExpired(user?.created_at)) {
      return (
        <div className="min-h-screen bg-transparent py-16 px-6">
          <ConvoGuard reason="trial_expired" plan={plan} />
        </div>
      );
    }

    if ((user?.daily_seconds_used || 0) >= 360) {
      return (
        <div className="min-h-screen bg-transparent py-16 px-6">
          <ConvoGuard reason="daily_limit_reached" plan={plan} />
        </div>
      );
    }
  }

  return (
    <div className="min-h-[calc(100vh)] lg:h-[300px] bg-transparent py-16 md:mx-10 xl:mx-40 sm:px-6 mt-5 md:mt-10">
      <ConvoWrapper companionId={id} />
    </div>
  );
}
