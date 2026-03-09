"use client";
import { format } from "date-fns";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/app/(app)/actions/actions";
import LoadingSpinner from "../LoadingSpinner";
import UpdateProfile from "./updateProfile";
import UpdatePlan from "./updatePlan";
import { memo, useMemo } from "react";
import { buildProfileInfoItems } from "./profileInfoItems";
import ProfileContainerPresenter from "./ProfileContainerPresenter";

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

  const actions = useMemo(
    () => (
      <>
        <UpdatePlan />
        <UpdateProfile
          data={data}
          user={user}
          userFirstNameInitial={profileView.userFirstNameInitial}
        />
      </>
    ),
    [data, profileView.userFirstNameInitial, user],
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
    <ProfileContainerPresenter
      imgSrc={profileView.avatar}
      userFullName={profileView.userFullName}
      userFirstNameInitial={profileView.userFirstNameInitial}
      planLabel={profileView.planLabel}
      userPlan={profileView.userPlan}
      infoItems={bucket}
      actions={actions}
    />
  );
}

export default memo(ProfileContainer);
