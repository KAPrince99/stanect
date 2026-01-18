import { Metadata } from "next";
import SignupClient from "./signupClient";

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
      <SignupClient />
    </main>
  );
}
