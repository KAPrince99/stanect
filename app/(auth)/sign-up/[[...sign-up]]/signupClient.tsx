"use client";

import dynamic from "next/dynamic";

import { AuthRouteLoading } from "@/components/ui/auth/AuthSkeleton";

const SignupComponent = dynamic(
  () => import("@/components/ui/SignupComponent"),
  {
    ssr: false,
    loading: () => <AuthRouteLoading mode="signup" />,
  },
);

export default function SignupClient() {
  return <SignupComponent />;
}
