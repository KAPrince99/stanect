"use client";

import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const SignupComponent = dynamic(
  () => import("@/components/ui/SignupComponent"),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  }
);

export default function SignupClient() {
  return <SignupComponent />;
}
