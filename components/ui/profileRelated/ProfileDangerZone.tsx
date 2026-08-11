"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { memo, useState } from "react";
import { toast } from "sonner";

import DeleteAccountDialog from "./DeleteAccountDialog";

function ProfileDangerZone() {
  const { user } = useUser();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!user) return;
    try {
      setDeleting(true);
      await user.delete();
      toast.success("Account deleted");
      router.push("/");
    } catch {
      toast.error("Could not delete account. Try again from Manage account.");
      setDeleting(false);
    }
  }

  return (
    <DeleteAccountDialog deleting={deleting} onConfirm={handleDelete} />
  );
}

export default memo(ProfileDangerZone);
