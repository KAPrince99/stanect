"use client";
import { useSearchParams } from "next/navigation";
import DesktopAvatarSelection from "./desktopAvatarSelection";
import AvatarForm from "./avatarForm";

export default function CreateCompanion() {
  const params = useSearchParams();
  const urlSelected = params.get("selectedAvatar");

  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 gap-1 sm:gap-7 xl:gap-1 min-h-screen ">
      <DesktopAvatarSelection />
      <AvatarForm urlSelected={urlSelected} />
    </main>
  );
}
