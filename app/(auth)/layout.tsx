import React, { ReactNode } from "react";

// ONLY metadata if needed; DO NOT include viewport or themeColor
export const metadata = {
  title: " Stanect",
  description: "Sign in to your Stanect account",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-y-auto flex items-center justify-center">
      {/* Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-br from-backdrop-from via-backdrop-via to-backdrop-to" />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
      </div>
      {children}
    </div>
  );
}
