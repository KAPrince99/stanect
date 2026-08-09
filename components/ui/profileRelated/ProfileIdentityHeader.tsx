import Image from "next/image";
import { memo, useState } from "react";
import ProfilePlanBadge from "./ProfilePlanBadge";

const FALLBACK_AVATAR = "/avatars/avatar_0.jpg";

interface ProfileIdentityHeaderProps {
  imgSrc: string;
  userFullName: string;
  userFirstNameInitial: string;
  planLabel: string;
  userPlan: string;
}

function ProfileIdentityHeader({
  imgSrc,
  userFullName,
  userFirstNameInitial,
  planLabel,
  userPlan,
}: ProfileIdentityHeaderProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const displaySrc = hasImageError ? FALLBACK_AVATAR : imgSrc;

  return (
    <div className="relative z-10 grid grid-cols-[1fr_3fr] items-center gap-4 md:place-items-center md:px-6">
      <div className="h-28 w-28 rounded-full bg-linear-to-br from-amber-400 to-orange-600 p-1 shadow-xl md:h-32 md:w-32">
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-gray-900 text-4xl font-bold text-white">
          {imgSrc ? (
            <Image
              src={displaySrc}
              alt={userFullName}
              fill
              sizes="128px"
              className="object-cover"
              onError={() => setHasImageError(true)}
            />
          ) : (
            <span>{userFirstNameInitial}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-start space-y-2">
        <h1 className="type-title text-xl md:text-2xl">{userFullName}</h1>
        <p className="type-meta flex items-center gap-2 text-sm">
          {planLabel}
          <ProfilePlanBadge userPlan={userPlan} />
        </p>
      </div>
    </div>
  );
}

export default memo(ProfileIdentityHeader);
