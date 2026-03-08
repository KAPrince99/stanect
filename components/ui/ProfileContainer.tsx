"use client";
import { format } from "date-fns";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/app/(app)/actions/actions";
import LoadingSpinner from "./LoadingSpinner";
import UpdateProfile from "./updateProfile";
import UpdatePlan from "./updatePlan";
import { memo, useMemo, useState, useEffect } from "react";
import ProfileIdentityHeader from "./ProfileIdentityHeader";
import ProfileInfoList from "./ProfileInfoList";
import { buildProfileInfoItems } from "./profileInfoItems";

function ProfileContainer() {
  const { user, isLoaded } = useUser();
  const userId = user?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => getUser(userId as string),
    enabled: !!userId && isLoaded,
    staleTime: Infinity,
  });

  const avatar = useMemo(() => {
    if (data?.profile_picture) {
      return data.profile_picture.startsWith("blob:")
        ? data.profile_picture
        : `${data.profile_picture}?t=${new Date().getTime()}`;
    }
    if (user?.imageUrl) return user.imageUrl;
    return "/avatars/avatar_0.jpg";
  }, [data?.profile_picture, user?.imageUrl]);

  const [imgSrc, setImgSrc] = useState(avatar);

  useEffect(() => {
    setImgSrc(avatar);
  }, [avatar]);

  const joinedDate = useMemo(() => {
    if (!user?.createdAt) return "Unknown";
    return format(new Date(user.createdAt), "dd MMMM yyyy");
  }, [user?.createdAt]);

  const clerkEmail = user?.primaryEmailAddress?.emailAddress;

  const userEmail = useMemo(
    () => data?.email || clerkEmail || "N/A",
    [data?.email, clerkEmail],
  );

  const userFullName = useMemo(
    () => data?.name || user?.fullName || "User",
    [data?.name, user?.fullName],
  );

  const userCountry = useMemo(
    () => data?.country || (user?.publicMetadata?.country as string) || "Earth",
    [data?.country, user?.publicMetadata?.country],
  );

  const userFirstNameInitial = userFullName.charAt(0);

  const userPlan = useMemo(
    () => (data?.plan ?? "free").trim().split(" ")[0],
    [data?.plan],
  );

  const planLabel = useMemo(() => {
    if (userPlan === "pro") return "Pro Member";
    if (userPlan === "king") return "King Member";
    return "Free Plan";
  }, [userPlan]);

  const displayTime = useMemo(() => {
    const totalSeconds = data?.total_lifetime_seconds || 0;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hDisplay =
      hours > 0 ? `${new Intl.NumberFormat().format(hours)} hrs ` : "";

    return `${hDisplay}${minutes} min ${seconds} secs`;
  }, [data?.total_lifetime_seconds]);

  const bucket = useMemo(
    () =>
      buildProfileInfoItems({
        userEmail,
        userCountry,
        joinedDate,
        displayTime,
      }),
    [userEmail, userCountry, joinedDate, displayTime],
  );

  if (!isLoaded || isLoading) return <LoadingSpinner />;

  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden mt-5 md:backdrop-blur-2xl md:bg-white/10 md:border md:border-white/20 md:rounded-3xl md:shadow-2xl">
        {/* LEFT */}
        <div className="grid relative p-8 md:p-10 text-center border-b border-gray-700/50">
          <ProfileIdentityHeader
            imgSrc={imgSrc}
            userFullName={userFullName}
            userFirstNameInitial={userFirstNameInitial}
            planLabel={planLabel}
            userPlan={userPlan}
            onAvatarError={() => setImgSrc("/avatars/avatar_0.jpg")}
          />

          <div className="flex gap-4 mt-10 justify-center">
            <UpdatePlan />
            <UpdateProfile
              data={data}
              user={user}
              userFirstNameInitial={userFirstNameInitial}
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
