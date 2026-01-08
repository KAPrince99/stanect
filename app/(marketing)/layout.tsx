import ScrollToTop from "@/components/ui/ScrollToTop";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { ReactNode, Suspense } from "react";
import { LenisProvider } from "../providers/lenisProvider";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex flex-col min-h-screen bg-linear-to-br from-[#0b1a36] via-[#0f2a5c] to-[#1e4ea8] text-white overflow-hidden">
      {/* Global glowing blob theme*/}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full 
                      bg-linear-to-r from-blue-600/30 to-cyan-500/20 
                      blur-3xl rounded-full animate-pulse-slow"
        />
      </div>
      <div className="relative z-10">
        <ScrollToTop />
        <Suspense fallback={null}>
          <SmoothScroll>
            <LenisProvider>{children}</LenisProvider>
          </SmoothScroll>
        </Suspense>
      </div>
    </div>
  );
}
