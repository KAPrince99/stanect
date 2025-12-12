// app/profile/page.tsx

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { auth, currentUser } from "@clerk/nextjs/server";
import { format } from "date-fns";
import {
  Mail,
  Globe,
  Calendar,
  Timer,
  Crown,
  Edit3,
  Sparkles,
  Award, // Using Award instead of Crown for plan type display
} from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  // Use a single check to handle unauthenticated state elegantly
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  // Derived state simplified
  const joinedDate = user.createdAt
    ? format(new Date(user.createdAt), "dd MMMM yyyy")
    : "Unknown";

  // Mock data for presentation (replace with real logic)
  const userPlan = "Pro";
  const totalMinutesTalked = 1247;
  const userCountry = user.publicMetadata.country || "Earth";
  const userFirstNameInitial = user.firstName?.[0] || "S";
  const userFullName = `${user.firstName || "King"} ${
    user.lastName || ""
  }`.trim();
  const userEmail = user.emailAddresses[0]?.emailAddress || "N/A";

  return (
    <div className="min-h-screen  overflow-hidden relative">
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 py-12 md:py-20">
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
      </div>
    </div>
  );
}

// Reusable Info Row component - simplified props destructuring
function InfoItem({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 p-4 md:p-5 rounded-xl transition-all duration-300 ${
        highlight
          ? "bg-amber-900/20 border border-amber-600/30"
          : "bg-gray-700/40 border border-gray-700/50"
      }`}
    >
      <div
        className={`p-3 rounded-lg bg-gray-800/50 ${
          highlight ? "text-amber-400" : "text-gray-400"
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-wider">
          {label}
        </p>
        <p className="text-md md:text-lg font-bold text-white mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}
