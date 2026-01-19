"use client";
import { format } from "date-fns";
import { InfoItem } from "@/components/ui/InfoItem";
import { Separator } from "@/components/ui/separator";
import { Mail, Globe, Calendar, Timer, Sparkles, Award } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/app/(app)/actions/actions";
import LoadingSpinner from "./LoadingSpinner";
import UpdateProfile from "./updateProfile";
import Image from "next/image";
import UpdatePlan from "./updatePlan";

export default function ProfileContainer() {
  const { user } = useUser();

  const { data, isLoading } = useQuery({
    queryKey: ["users", user?.id],
    queryFn: () => getUser(user?.id as string),
    enabled: !!user?.id,
  });

  if (isLoading) return <LoadingSpinner />;

  const plan = data?.plan ?? "free";
  const joinedDate = user?.createdAt
    ? format(new Date(user.createdAt), "dd MMMM yyyy")
    : "Unknown";
  const userPlan = plan?.trim().split(" ")[0];

  const userFullName = data?.name || user?.fullName || "User";
  const userEmail =
    data?.email || user?.emailAddresses[0]?.emailAddress || "N/A";
  const userCountry =
    data?.country || (user?.publicMetadata?.country as string) || "Not Set";
  const userFirstNameInitial = userFullName[0] || "U";

  const bucket = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      value: userEmail,
    },
    {
      icon: <Globe className="w-5 h-5" />,
      label: "Location",
      value: userCountry,
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Member Since",
      value: joinedDate,
    },
    {
      icon: <Timer className="w-5 h-5" />,
      label: "Total Talk Time",
      value: `1,247 minutes`,
    },
  ];

  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden mt-5 md:backdrop-blur-2xl md:bg-white/10 md:border md:border-white/20 md:rounded-3xl md:shadow-2xl">
        <div className="grid relative p-8 md:p-10 text-center border-b border-gray-700/50">
          <div className="grid grid-cols-[1fr_3fr] gap-4 md:place-items-center md:px-10 relative z-10">
            {/* Avatar Section */}
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-linear-to-br from-amber-400 to-orange-600 p-1 shadow-xl mb-4 md:mb-6">
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-white text-4xl md:text-5xl font-bold overflow-hidden relative">
                {data?.profile_picture ? (
                  <Image
                    src={data.profile_picture}
                    alt={userFullName}
                    fill
                    sizes="(max-width: 768px) 112px, 128px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <span>{userFirstNameInitial}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-start w-full space-y-2 lg:space-y-4">
              <h1 className="text-xl md:text-2xl font-extrabold text-white mb-2">
                {userFullName}
              </h1>
              <p className="text-gray-400 text-base md:text-lg font-medium flex items-center justify-center gap-2">
                {userPlan === "Pro" ? "Pro Member" : "Free Plan"}
                {userPlan === "Pro" && (
                  <Award className="w-4 h-4 text-amber-400 ml-1" />
                )}
                <Sparkles className="w-4 h-4 text-amber-400" />
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-10 md:mt-0 items-start justify-center">
            <UpdatePlan />
            <UpdateProfile data={data} />
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-rows-4 gap-6 max-w-3xl mx-auto">
            {bucket.map((item) => (
              <InfoItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                value={item.value}
              />
            ))}
          </div>
          <Separator className="my-4 md:my-5 bg-gray-700/50" />
        </div>
      </div>
    </div>
  );
}
