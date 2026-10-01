import Image from "next/image";
import { memo } from "react";

import { CompanionProps } from "@/types/types";

/** 4:5 on phones, square from tablet up. Shared with the ghost card. */
export const companionPortraitAspect = "aspect-4/5 md:aspect-square";

interface CompanionOverviewCardMediaProps {
  companion: CompanionProps;
}

function CompanionOverviewCardMedia({
  companion,
}: CompanionOverviewCardMediaProps) {
  return (
    <div className={`relative shrink-0 overflow-hidden ${companionPortraitAspect}`}>
      <Image
        src={companion.avatars.image_url}
        alt={companion.companion_name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 1024px) 50vw, 33vw"
      />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/15 to-transparent" />

      <div className="absolute top-2 left-2 max-w-[calc(100%-1rem)] truncate rounded-full bg-black/60 px-2 py-0.5 type-meta text-white/90 backdrop-blur-sm">
        {companion.duration} min
      </div>

      {companion.scene ? (
        <div className="absolute bottom-2 left-2 max-w-[calc(100%-1rem)] truncate rounded-full bg-white/10 px-2 py-0.5 type-meta text-white/90 capitalize backdrop-blur-sm">
          {companion.scene}
        </div>
      ) : null}
    </div>
  );
}

export default memo(CompanionOverviewCardMedia);
