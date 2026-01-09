import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ProfileContainer from "@/components/ui/ProfileContainer";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile – Stanect AI",
  description: "Manage your Stanect AI profile and account settings.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen  overflow-hidden relative mb-30 md:mb-0">
      <div className="relative z-10 flex items-center justify-center min-h-screen sm:px-6 py-12 md:py-20">
        <Suspense fallback={<LoadingSpinner />}>
          <ProfileContainer />
        </Suspense>
      </div>
    </main>
  );
}
