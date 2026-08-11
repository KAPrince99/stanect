"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { getUser } from "@/app/(app)/actions/actions";
import UserAvatarView from "./UserAvatarView";

export default function UserImageContainer() {
  const { user, isLoaded } = useUser();
  const userId = user?.id;

  const { data: supabaseUser, isFetching } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => getUser(),
    enabled: !!userId && isLoaded,
    staleTime: Infinity,
  });

  const avatar = useMemo(() => {
    if (supabaseUser?.profile_picture) return supabaseUser.profile_picture;
    if (user?.imageUrl) return user.imageUrl;
    return "/avatars/avatar_0.jpg";
  }, [supabaseUser?.profile_picture, user?.imageUrl]);

  if (!isLoaded) {
    return (
      <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-gray-800" />
    );
  }

  return <UserAvatarView src={avatar} isFetching={isFetching} />;
}
