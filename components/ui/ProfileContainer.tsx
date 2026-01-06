"use client";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { InfoItem } from "@/components/ui/InfoItem";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Globe,
  Calendar,
  Timer,
  Crown,
  Edit3,
  Sparkles,
  Award,
  Loader2,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/app/(app)/actions/actions";
import LoadingSpinner from "./LoadingSpinner";
export default function ProfileContainer() {
  const { user } = useUser();

  const { data, isLoading } = useQuery({
    queryKey: ["users", user?.id],
    queryFn: () => getUser(user!.id),
    enabled: !!user?.id,
  });

  const plan = data?.plan ?? "free";

  const joinedDate = user?.createdAt
    ? format(new Date(user.createdAt), "dd MMMM yyyy")
    : "Unknown";

  const userPlan = plan?.trim().split(" ")[0];
  const totalMinutesTalked = 1247;
  const userCountry = user?.publicMetadata.country || "Earth";
  const userFirstNameInitial = user?.firstName?.[0] || "S";
  const userFullName = `${user?.firstName || "King"} ${
    user?.lastName || ""
  }`.trim();
  const userEmail = user?.emailAddresses[0]?.emailAddress || "N/A";

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="w-full max-w-5xl">
      {/* Main Card Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden mt-5 ">
        {/* Header Section */}
        <div className="grid  relative p-8 md:p-10 text-center border-b border-gray-700/50">
          <div className="grid grid-cols-[1fr_3fr] gap-4 md:place-items-center md:px-10 relative z-10">
            {/* Avatar Placeholder */}
            <div className=" w-28 h-28 md:w-32 md:h-32 rounded-full bg-linear-to-br from-amber-400 to-orange-600 p-1 shadow-xl mb-4 md:mb-6 ">
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-white text-4xl md:text-5xl font-bold">
                {userFirstNameInitial}
              </div>
            </div>
            <div className="flex flex-col items-start w-full  space-y-2 lg:space-y-4">
              <div>
                <h1 className="text-xl md:text-2xl font-extrabold text-white mb-2">
                  {userFullName}
                </h1>
              </div>

              {/* Plan Indicator */}
              <div>
                <p className="text-gray-400 text-base md:text-lg font-medium flex items-center justify-center gap-2">
                  {userPlan === "Pro" ? "Pro Member" : "Free Plan"}
                  {userPlan === "Pro" && (
                    <Award className="w-4 h-4 text-amber-400 ml-1" />
                  )}
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </p>
              </div>

              {/* Stats Badge */}
              <div className=" text-center">
                <p className="text-base font-black text-white mt-1">
                  Tier :{" "}
                  <span className="text-gray-400">
                    {totalMinutesTalked > 1000 ? "Elite" : "Rising Star"}
                  </span>
                </p>
              </div>
            </div>
          </div>
          {/* Action Buttons (Responsive stacking) */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10 md:mt-0 items-start justify-center">
            <Button
              size="lg"
              className="w-full sm:w-auto px-8 h-12 text-base font-semibold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black shadow-lg shadow-amber-500/30"
            >
              <Crown className="w-5 h-5 mr-2" />
              Upgrade Plan
            </Button>

            <Button
              size="lg"
              className="w-full sm:w-auto px-8 h-12 text-base font-semibold border-gray-600 hover:bg-gray-700/50 text-white"
            >
              <Edit3 className="w-5 h-5 mr-2" />
              update Profile
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-8 md:p-10">
          {/* Info Grid (Responsive 1 or 2 cols) */}
          <div className="grid grid-cols-1 md:grid-rows-4 gap-6 max-w-3xl mx-auto">
            <InfoItem
              icon={<Mail className="w-5 h-5" />}
              label="Email"
              value={userEmail}
            />
            <InfoItem
              icon={<Globe className="w-5 h-5" />}
              label="Location"
              value={userCountry}
            />
            <InfoItem
              icon={<Calendar className="w-5 h-5" />}
              label="Member Since"
              value={joinedDate}
            />
            <InfoItem
              icon={<Timer className="w-5 h-5" />}
              label="Total Talk Time"
              value={`${totalMinutesTalked} minutes`}
              highlight
            />
          </div>

          <Separator className="my-4 md:my-5 bg-gray-700/50" />
        </div>
      </div>
    </div>
  );
}
