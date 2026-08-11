"use client";

import { SignUp } from "@clerk/nextjs";

import { stanectClerkAppearance } from "@/lib/clerk-appearance";

import AuthStage from "./auth/AuthStage";

export default function SignupComponent() {
  return (
    <AuthStage
      title="Start practicing"
      description="Create an account, build a companion, and talk out loud — judgment-free."
    >
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/login"
        fallbackRedirectUrl="/dashboard"
        appearance={stanectClerkAppearance}
      />
    </AuthStage>
  );
}
