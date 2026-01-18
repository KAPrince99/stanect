"use client";

import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const LoginComponent = dynamic(() => import("@/components/ui/LoginComponent"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

export default function LoginClient() {
  return <LoginComponent />;
}
