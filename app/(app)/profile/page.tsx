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
    <section className="app-column-x relative pt-24 pb-28 md:pb-16 lg:pt-28">
      <ProfileContainer userId={userId} />
    </section>
  );
}
