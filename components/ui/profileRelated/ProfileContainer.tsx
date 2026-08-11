"use client";

import { format } from "date-fns";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { memo, useMemo } from "react";

import { getCompanions, getUser } from "@/app/(app)/actions/actions";
import { fetchSubscriptionStatus } from "@/app/(app)/actions/subs";
import LoadingSpinner from "../LoadingSpinner";
import UpdateProfile from "./updateProfile";
import UpdatePlan from "./updatePlan";
import { buildProfileInfoItems } from "./profileInfoItems";
import ProfileContainerPresenter from "./ProfileContainerPresenter";
import ProfileBillingActions from "./ProfileBillingSection";
import ProfileSecuritySection from "./ProfileSecuritySection";
import ProfileDangerZone from "./ProfileDangerZone";
import type { Userprops } from "@/types/types";

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

function ProfileContainer({ userId }: { userId: string }) {
  const { user } = useUser();

  const {
    data,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  const { data: companions = [], isLoading: isCompanionsLoading } = useQuery({
    queryKey: ["companions", userId],
    queryFn: () => getCompanions(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  const { data: subscription, isLoading: isSubLoading } = useQuery({
    queryKey: ["subscription", userId],
    queryFn: () => fetchSubscriptionStatus(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  const profileView = useMemo(() => {
    const clerkEmail = user?.primaryEmailAddress?.emailAddress;
    const userFullName = data?.name || user?.fullName || "User";
    const userPlan = (data?.plan ?? subscription?.plan ?? "free")
      .toString()
      .trim()
      .split(" ")[0]
      .toLowerCase();
    const joinedDate = user?.createdAt
      ? format(new Date(user.createdAt), "dd MMMM yyyy")
      : "Unknown";

    return {
      avatar: data?.profile_picture || user?.imageUrl || FALLBACK_AVATAR,
      userEmail: data?.email || clerkEmail || "N/A",
      userFullName,
      userCountry:
        data?.country || (user?.publicMetadata?.country as string) || "Earth",
      joinedDate,
      displayTime: formatTotalTalkTime(
        Number(data?.total_lifetime_seconds ?? 0),
      ),
      userPlan,
      planLabel: getPlanLabel(userPlan),
      userFirstNameInitial: userFullName.charAt(0),
      dailySecondsUsed: Number(data?.daily_seconds_used ?? 0),
      subscriptionStatus: (subscription?.status || data?.status || "active")
        .toString()
        .toLowerCase(),
    };
  }, [data, subscription, user]);

  const infoItems = useMemo(
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

  const isPaid =
    profileView.userPlan === "pro" || profileView.userPlan === "king";

  const actions = useMemo(
    () => (
      <>
        <UpdatePlan label={isPaid ? "Change Plan" : "Upgrade Plan"} />
        <UpdateProfile
          data={(data ?? {}) as Userprops}
          user={user}
          userFirstNameInitial={profileView.userFirstNameInitial}
        />
      </>
    ),
    [data, isPaid, profileView.userFirstNameInitial, user],
  );

  const billingActions = useMemo(
    () => (isPaid ? <ProfileBillingActions userId={userId} /> : null),
    [isPaid, userId],
  );

  const accountActions = useMemo(
    () => (
      <>
        <ProfileSecuritySection />
        <span className="text-white/20" aria-hidden>
          ·
        </span>
        <ProfileDangerZone />
      </>
    ),
    [],
  );

  if (isUserLoading || isCompanionsLoading || isSubLoading) {
    return <LoadingSpinner />;
  }

  if (isUserError) {
    return (
      <div className="mt-5 w-full max-w-4xl text-red-300">
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
      subscriptionStatus={profileView.subscriptionStatus}
      dailySecondsUsed={profileView.dailySecondsUsed}
      companionCount={Array.isArray(companions) ? companions.length : 0}
      infoItems={infoItems}
      actions={actions}
      billingActions={billingActions}
      accountActions={accountActions}
    />
  );
}

export default memo(ProfileContainer);
