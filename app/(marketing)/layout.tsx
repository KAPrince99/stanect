import ScrollToTop from "@/components/ui/ScrollToTop";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { ReactNode, Suspense } from "react";
import { LenisProvider } from "../providers/lenisProvider";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex flex-col min-h-screen bg-linear-to-br from-backdrop-from via-backdrop-via-deep to-backdrop-to text-white overflow-x-hidden">
      {/* Global glowing blob theme */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none z-0"
        aria-hidden="true"
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full 
                     bg-linear-to-r from-blue-600/30 to-cyan-500/20 
                     blur-3xl rounded-full animate-pulse-slow"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10">
        <ScrollToTop />
        <Suspense fallback={null}>
          <LenisProvider>
            <main>{children}</main>
          </LenisProvider>
        </Suspense>
      </div>
    </div>
  );
}
