import ProfileContainer from "@/components/ui/ProfileContainer";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen  overflow-hidden relative">
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 py-12 md:py-20">
        <ProfileContainer />
      </div>
    </div>
  );
}
