"use client";
import DesktopAvatarSelection from "./desktopAvatarSelection";
import AvatarForm from "./avatarForm";
import { useQuery } from "@tanstack/react-query";
import { getAvatars } from "@/app/(app)/actions/actions";

export default function CreateCompanion() {
  const {
    data: avatars,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["avatars"],
    queryFn: getAvatars,
  });

  if (error) throw new Error(error.message);
  if (isLoading) return <div>Loading...</div>;

  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 gap-1 sm:gap-7 xl:gap-1 min-h-screen ">
      <DesktopAvatarSelection avatars={avatars!} />
      <AvatarForm avatars={avatars!} />
    </main>
  );
}
