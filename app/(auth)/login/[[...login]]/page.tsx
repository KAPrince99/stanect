import { Metadata } from "next";
import LoginClient from "./loginClient";

export const metadata: Metadata = {
  title: "Login – Stanect AI",
  description:
    "Login to your Stanect AI account to access your dashboard and AI companions.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen py-12">
      <LoginClient />
    </main>
  );
}
