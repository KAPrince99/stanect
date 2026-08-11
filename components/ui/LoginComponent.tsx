"use client";

import { SignIn } from "@clerk/nextjs";

import { stanectClerkAppearance } from "@/lib/clerk-appearance";

import AuthStage from "./auth/AuthStage";

export default function LoginComponent() {
  return (
    <AuthStage
      title="Welcome back"
      description="Private voice practice for the conversations that make your chest tighten."
    >
      <SignIn
        routing="path"
        path="/login"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/dashboard"
        appearance={stanectClerkAppearance}
      />
    </AuthStage>
  );
}
