"use client";

import dynamic from "next/dynamic";

import { AuthRouteLoading } from "@/components/ui/auth/AuthSkeleton";

const LoginComponent = dynamic(() => import("@/components/ui/LoginComponent"), {
  ssr: false,
  loading: () => <AuthRouteLoading mode="login" />,
});

export default function LoginClient() {
  return <LoginComponent />;
}
