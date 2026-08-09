import Image from "next/image";
import { memo } from "react";

import { CompanionProps } from "@/types/types";

interface CompanionOverviewCardMediaProps {
  companion: CompanionProps;
}

function CompanionOverviewCardMedia({
  companion,
}: CompanionOverviewCardMediaProps) {
  return (
    <div className="relative aspect-square overflow-hidden">
      <Image
        src={companion.avatars.image_url}
        alt={companion.companion_name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/15 to-transparent" />

      <div className="absolute left-2.5 top-2.5 rounded-full bg-black/60 px-2 py-0.5 type-meta text-white/90 backdrop-blur-sm">
        {companion.duration} min
      </div>

      <div className="absolute bottom-2.5 left-2.5 rounded-full bg-white/10 px-2 py-0.5 type-meta capitalize text-white/90 backdrop-blur-sm">
        {companion.scene}
      </div>
    </div>
  );
}

export default memo(CompanionOverviewCardMedia);
