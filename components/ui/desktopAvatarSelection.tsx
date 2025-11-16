"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { AvatarProps } from "@/types/types";

export default function DesktopAvatarSelection({
  avatars,
}: {
  avatars: AvatarProps[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const urlSelected = params.get("avatarId");

  const [selected, setSelected] = useState<string | null>(urlSelected);

  useEffect(() => {
    if (selected !== urlSelected) {
      router.replace(`?avatarId=${selected}`);
    }
  }, [selected]);

  return (
    <main className="hidden lg:block">
      <section className="bg-stone-100 grid grid-cols-4 gap-2 ">
        {avatars.map((avatar) => {
          const isSelected = selected === avatar.id;

          return (
            <div
              role="button"
              key={avatar.id}
              onClick={() => setSelected(avatar.id)}
              className={`
              relative aspect-square w-30  overflow-hidden cursor-pointer rounded-md
              border-6 transition-all
              ${isSelected ? " border-black" : " border-transparent"}
            `}
            >
              <Image
                src={avatar.image_url!}
                alt={avatar.name}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 25vw, 100vw"
                priority
              />
            </div>
          );
        })}
      </section>
    </main>
  );
}
