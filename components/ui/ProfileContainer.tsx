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

  if (isLoading)
    return (
      <div className="flex justify-center items-center my-50">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="w-full max-w-4xl">
      {/* Main Card Container */}
      <div className=" overflow-hidden">
        {/* Header Section */}
        <div className="relative p-8 md:p-10  text-center border-b border-gray-700/50">
          <div className="relative z-10">
            {/* Avatar Placeholder */}
            <div className="mx-auto w-28 h-28 md:w-32 md:h-32 rounded-full bg-linear-to-br from-amber-400 to-orange-600 p-1 shadow-xl mb-4 md:mb-6">
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-white text-4xl md:text-5xl font-bold">
                {userFirstNameInitial}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
              {userFullName}
            </h1>

            {/* Plan Indicator */}
            <p className="text-gray-400 text-base md:text-lg font-medium flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {userPlan === "Pro" ? "Pro Member" : "Free Plan"}
              {userPlan === "Pro" && (
                <Award className="w-4 h-4 text-amber-400 ml-1" />
              )}
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-8 md:p-10">
          {/* Info Grid (Responsive 1 or 2 cols) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
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

          {/* Action Buttons (Responsive stacking) */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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

          {/* Stats Badge */}
          <div className="mt-12 md:mt-16 text-center">
            <p className="text-gray-500 text-sm uppercase tracking-wider">
              Engagement Tier
            </p>
            <p className="text-xl md:text-3xl font-black text-white mt-1">
              {totalMinutesTalked > 1000 ? "Elite" : "Rising Star"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
