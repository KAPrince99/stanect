import { Button } from "./button";
import Image from "next/image";
import Link from "next/link";
import { CompanionProps } from "@/types/types";

export default function CompanionCard({
  companion,
}: {
  companion: CompanionProps;
}) {
  return (
    <article
      className="
    w-full
    bg-stone-100 shadow-sm
    overflow-hidden
    transition-all duration-300 hover:shadow-lg
    p-1 mt-2 sm:mt-5 rounded-2xl
  "
    >
      <div className="w-full aspect-square relative">
        <Image
          src={companion.avatars.image_url!}
          alt={companion.name}
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, 300px"
          loading="eager"
        />
        <p className="bg-black text-stone-100 absolute top-2 left-2 rounded px-2 text-sm">
          {companion.duration} mins
        </p>
      </div>

      <div className="p-4 flex flex-col gap-2 text-center">
        <div>
          <p className="text-lg font-semibold text-gray-800">
            {companion.name}
          </p>
          <p className="text-sm text-gray-500">{companion.venue}</p>
        </div>

        <Link href={`/dashboard/${companion.id}`}>
          <Button
            className="
          w-full cursor-pointer
          transition-all duration-200
          hover:scale-[1.03]
          hover:bg-primary/90
          active:scale-[0.98]
          font-medium
          tracking-wide
        "
          >
            Let&apos;s Talk
          </Button>
        </Link>
      </div>
    </article>
  );
}
