"use client";
import { format } from "date-fns";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/app/(app)/actions/actions";
import LoadingSpinner from "./LoadingSpinner";
import UpdateProfile from "./updateProfile";
import UpdatePlan from "./updatePlan";
import { memo, useMemo } from "react";
import ProfileIdentityHeader from "./ProfileIdentityHeader";
import ProfileInfoList from "./ProfileInfoList";
import { buildProfileInfoItems } from "./profileInfoItems";

const FALLBACK_AVATAR = "/avatars/avatar_0.jpg";
const talkTimeFormatter = new Intl.NumberFormat();

function formatTotalTalkTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hDisplay = hours > 0 ? `${talkTimeFormatter.format(hours)} hrs ` : "";

  return `${hDisplay}${minutes} min ${seconds} secs`;
}

function getPlanLabel(plan: string) {
  if (plan === "pro") return "Pro Member";
  if (plan === "king") return "King Member";
  return "Free Plan";
}

function ProfileContainer() {
  const { user, isLoaded } = useUser();
  const userId = user?.id;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => getUser(userId as string),
    enabled: !!userId && isLoaded,
    staleTime: Infinity,
  });

  const profileView = useMemo(() => {
    const clerkEmail = user?.primaryEmailAddress?.emailAddress;
    const userFullName = data?.name || user?.fullName || "User";
    const userPlan = (data?.plan ?? "free").trim().split(" ")[0];
    const joinedDate = user?.createdAt
      ? format(new Date(user.createdAt), "dd MMMM yyyy")
      : "Unknown";

    const avatar = data?.profile_picture || user?.imageUrl || FALLBACK_AVATAR;

    return {
      avatar,
      userEmail: data?.email || clerkEmail || "N/A",
      userFullName,
      userCountry:
        data?.country || (user?.publicMetadata?.country as string) || "Earth",
      joinedDate,
      displayTime: formatTotalTalkTime(data?.total_lifetime_seconds || 0),
      userPlan,
      planLabel: getPlanLabel(userPlan),
      userFirstNameInitial: userFullName.charAt(0),
    };
  }, [data, user]);

  const bucket = useMemo(
    () =>
      buildProfileInfoItems({
        userEmail: profileView.userEmail,
        userCountry: profileView.userCountry,
        joinedDate: profileView.joinedDate,
        displayTime: profileView.displayTime,
      }),
    [
      profileView.displayTime,
      profileView.joinedDate,
      profileView.userCountry,
      profileView.userEmail,
    ],
  );

  if (!isLoaded || isLoading) return <LoadingSpinner />;
  if (isError) {
    return (
      <div className="w-full max-w-5xl mt-5 text-red-300">
        Unable to load profile details right now.
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden mt-5 md:backdrop-blur-2xl md:bg-white/10 md:border md:border-white/20 md:rounded-3xl md:shadow-2xl">
        {/* LEFT */}
        <div className="grid relative p-8 md:p-10 text-center border-b border-gray-700/50">
          <ProfileIdentityHeader
            key={profileView.avatar}
            imgSrc={profileView.avatar}
            userFullName={profileView.userFullName}
            userFirstNameInitial={profileView.userFirstNameInitial}
            planLabel={profileView.planLabel}
            userPlan={profileView.userPlan}
          />

          <div className="flex gap-4 mt-10 justify-center">
            <UpdatePlan />
            <UpdateProfile
              data={data}
              user={user}
              userFirstNameInitial={profileView.userFirstNameInitial}
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="p-8 md:p-10">
          <ProfileInfoList items={bucket} />
        </div>
      </div>
    </div>
  );
}

export default memo(ProfileContainer);
