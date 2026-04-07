import Image from "next/image";
import { memo } from "react";

import { CompanionProps } from "@/types/types";

import LordIcon from "../lordIcon";

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
        className="object-cover transform transition-transform duration-500 group-hover:scale-105"
        style={{ willChange: "transform" }}
      />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5">
        <LordIcon
          src="https://cdn.lordicon.com/zjuyeglr.json"
          trigger="hover"
          colors="primary:#e88c30,secondary:#e88c30,tertiary:#ebe6ef,quaternary:#e88c30"
          height={20}
          width={20}
        />
        <span className="text-sm font-medium">{companion.duration} min</span>
      </div>

      <div className="absolute bottom-4 left-4 rounded-full bg-white/10 px-3 py-1.5">
        <span className="text-sm font-medium capitalize">
          {companion.scene}
        </span>
      </div>

      <div className="absolute right-4 top-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <LordIcon
          src="https://cdn.lordicon.com/ewmfucya.json"
          trigger="hover"
          colors="primary:#e83a30,secondary:#e83a30,tertiary:#e83a30,quaternary:#e83a30,quinary:#f24c00,senary:#ffffff"
          height={30}
          width={30}
        />
      </div>
    </div>
  );
}

export default memo(CompanionOverviewCardMedia);
