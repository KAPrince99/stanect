import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import ProfileContainer from "@/components/ui/profileRelated/ProfileContainer";

export const metadata: Metadata = {
  title: "Profile – Stanect AI",
  description: "Manage your Stanect AI profile and account settings.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  return (
    <main className="relative mb-30 min-h-screen overflow-hidden md:mb-0">
      <div className="relative z-10 flex min-h-screen items-center justify-center py-12 sm:px-6 md:py-20">
        <ProfileContainer userId={userId} />
      </div>
    </main>
  );
}
