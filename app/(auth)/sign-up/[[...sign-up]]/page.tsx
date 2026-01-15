import LoadingSpinner from "@/components/ui/LoadingSpinner";
import SignupComponent from "@/components/ui/SignupComponent";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign Up – Stanect AI",
  description:
    "Create a new account for Stanect AI and start building AI voice companions.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SignUpPage() {
  return (
    <main className="flex items-center justify-center min-h-screen px-6 py-12">
      <Suspense fallback={<LoadingSpinner />}>
        <SignupComponent />
      </Suspense>
    </main>
  );
}
