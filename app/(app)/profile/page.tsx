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
    <section className="relative px-4 pt-24 pb-28 sm:px-6 lg:pt-28 md:pb-16">
      <ProfileContainer userId={userId} />
    </section>
  );
}
