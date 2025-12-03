import ScrollToTop from "@/components/ui/ScrollToTop";
import { ReactNode } from "react";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-[#0b1a36] via-[#0f2a5c] to-[#1e4ea8] text-white overflow-hidden">
      {/* 🔥 Global glowing background (same blob theme everywhere) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full 
                      bg-gradient-to-r from-blue-600/30 to-cyan-500/20 
                      blur-3xl rounded-full animate-pulse-slow"
        />

        {/* <div
          className="absolute -top-40 -right-40 w-screen h-screen
                      bg-purple-600/20 blur-3xl rounded-full animate-float"
        /> */}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <ScrollToTop />
        {children}
      </div>
    </div>
  );
}
