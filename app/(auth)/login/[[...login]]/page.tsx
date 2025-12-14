"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen p-6">
      <SignIn routing="path" path="/login" signUpUrl="/sign-up" />
    </main>
  );
}
