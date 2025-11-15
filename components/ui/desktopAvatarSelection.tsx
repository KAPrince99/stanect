"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mockData } from "@/mock/data";
import Image from "next/image";

export default function DesktopAvatarSelection() {
  const router = useRouter();
  const params = useSearchParams();
  const urlSelected = params.get("selectedAvatar");

  const [selected, setSelected] = useState<string | null>(
    urlSelected !== null ? urlSelected : null
  );

  useEffect(() => {
    if (selected !== null) {
      router.replace(`?selectedAvatar=${selected}`);
    }
  }, [selected, router]);

  return (
    <main className="hidden lg:block">
      <section className="bg-stone-100 grid grid-cols-4 gap-2 ">
        {mockData.map((data) => {
          const isSelected = selected === data.image;

          return (
            <div
              key={data.name}
              onClick={() => setSelected(data.image)}
              className={`
              relative aspect-square w-30  overflow-hidden cursor-pointer rounded-md
              border-6 transition-all
              ${isSelected ? " border-black" : " border-transparent"}
            `}
            >
              <Image
                src={data.image}
                alt={data.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          );
        })}
      </section>
    </main>
  );
}
