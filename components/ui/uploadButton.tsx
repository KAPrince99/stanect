"use client";
import { setAvatarData } from "@/mock/action";
import { Button } from "./button";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

export default function UploadButton() {
  const [isPending, startTransition] = useTransition();
  function handleClick() {
    startTransition(async () => {
      await setAvatarData();
    });
  }
  return (
    <Button
      className="cursor-pointer active:opacity-0.5 hidden "
      onClick={handleClick}
    >
      {isPending ? <Loader2 className="animate-spin" /> : "upload"}
    </Button>
  );
}
