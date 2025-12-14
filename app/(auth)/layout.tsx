import React, { ReactNode } from "react";

// ONLY metadata if needed; DO NOT include viewport or themeColor
export const metadata = {
  title: " Stanect",
  description: "Sign in to your Stanect account",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-br from-[#0b1a36] via-[#1a3a80] to-[#1e4ea8]" />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
      </div>
      {children}
    </div>
  );
}
