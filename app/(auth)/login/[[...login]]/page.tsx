import { Metadata } from "next";
import LoginClient from "./loginClient";

export const metadata: Metadata = {
  title: "Login – Stanect AI",
  description: "Login to your Stanect AI account.",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen py-10 px-4 md:py-12 overflow-y-auto">
      <LoginClient />
    </main>
  );
}
