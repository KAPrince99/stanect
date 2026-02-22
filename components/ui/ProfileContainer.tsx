"use client";
import { format } from "date-fns";
import { InfoItem } from "@/components/ui/InfoItem";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/app/(app)/actions/actions";
import LoadingSpinner from "./LoadingSpinner";
import UpdateProfile from "./updateProfile";
import Image from "next/image";
import UpdatePlan from "./updatePlan";
import LordIcon from "./lordIcon";
import { memo, useMemo, useState, useEffect } from "react";

function ProfileContainer() {
  const { user, isLoaded } = useUser();
  const userId = user?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => getUser(userId as string),
    enabled: !!userId && isLoaded,
    staleTime: Infinity,
  });

  /* ---------------- Avatar Source of Truth ---------------- */

  const avatar = useMemo(() => {
    if (data?.profile_picture) return data.profile_picture;
    if (user?.imageUrl) return user.imageUrl;
    return "/avatars/avatar_0.jpg";
  }, [data?.profile_picture, user?.imageUrl]);

  const [imgSrc, setImgSrc] = useState(avatar);

  /* SAFE sync */
  useEffect(() => {
    setImgSrc(avatar);
  }, [avatar]);

  /* ---------------- Derived Values ---------------- */

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
    () => [
      {
        icon: (
          <LordIcon
            src="https://cdn.lordicon.com/gtvaxhwv.json"
            trigger="loop"
            colors="primary:#e88c30,secondary:#ebe6ef,tertiary:#e88c30,quaternary:#e88c30"
            height={35}
            width={35}
          />
        ),
        label: "Email",
        value: userEmail,
      },
      {
        icon: (
          <LordIcon
            src="https://cdn.lordicon.com/tyntlpjn.json"
            trigger="loop"
            colors="primary:#ffffff,secondary:#e88c30"
            height={35}
            width={35}
          />
        ),
        label: "Location",
        value: userCountry,
      },
      {
        icon: (
          <LordIcon
            src="https://cdn.lordicon.com/laobovmg.json"
            trigger="loop"
            colors="primary:#e88c30"
            height={35}
            width={35}
          />
        ),
        label: "Member Since",
        value: joinedDate,
      },
      {
        icon: (
          <LordIcon
            src="https://cdn.lordicon.com/zjuyeglr.json"
            trigger="loop"
            colors="primary:#e88c30"
            height={35}
            width={35}
          />
        ),
        label: "Total Talk Time",
        value: displayTime,
      },
    ],
    [userEmail, userCountry, joinedDate, displayTime],
  );

  if (!isLoaded || isLoading) return <LoadingSpinner />;

  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden mt-5 md:backdrop-blur-2xl md:bg-white/10 md:border md:border-white/20 md:rounded-3xl md:shadow-2xl">
        {/* LEFT */}
        <div className="grid relative p-8 md:p-10 text-center border-b border-gray-700/50">
          <div className="grid grid-cols-[1fr_3fr] gap-4 md:place-items-center md:px-10 relative z-10">
            {/* Avatar */}
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-linear-to-br from-amber-400 to-orange-600 p-1 shadow-xl">
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-white text-4xl font-bold overflow-hidden relative">
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt={userFullName}
                    fill
                    sizes="128px"
                    className="object-cover"
                    onError={() => setImgSrc("/avatars/avatar_0.jpg")}
                  />
                ) : (
                  <span>{userFirstNameInitial}</span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col items-start space-y-2">
              <h1 className="text-xl md:text-2xl font-extrabold text-white">
                {userFullName}
              </h1>

              <p className="text-gray-400 text-base md:text-lg font-medium flex items-center gap-2">
                {planLabel}
                {userPlan === "free" && (
                  <LordIcon
                    src="https://cdn.lordicon.com/vgdksfqv.json"
                    trigger="loop"
                    colors="primary:#ffffff,secondary:#e88c30,tertiary:#e88c30"
                    height={40}
                    width={40}
                  />
                )}
                {userPlan === "pro" && (
                  <LordIcon
                    src="https://cdn.lordicon.com/ypilrraw.json"
                    trigger="loop"
                    colors="primary:#e88c30,secondary:#ffc738"
                    height={40}
                    width={40}
                  />
                )}
                {userPlan === "king" && (
                  <LordIcon
                    src="https://cdn.lordicon.com/qwghwbtk.json"
                    trigger="loop"
                    colors="primary:#e88c30,secondary:#ebe6ef,tertiary:#ffc738,quaternary:#646e78"
                    height={40}
                    width={40}
                  />
                )}
              </p>
            </div>
          </div>

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
          <div className="grid gap-6 max-w-3xl mx-auto">
            {bucket.map((item) => (
              <InfoItem key={item.label} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ProfileContainer);
