import MobileDock from "@/components/ui/mobileDock";
import Navbar from "@/components/ui/navbar";
import Sidebar from "@/components/ui/sidebar";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div lang="en" className="h-full w-screen">
      <div className="relative h-full text-white antialiased">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-linear-to-br from-[#0b1a36] via-[#1a3a80] to-[#1e4ea8]" />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Centered on the full page — same axis as dashboard content */}
        <Navbar />

        <div className="pointer-events-none fixed inset-y-0 left-0 z-40 hidden lg:block">
          <div className="pointer-events-auto h-full">
            <Sidebar />
          </div>
        </div>

        <div className="flex h-screen flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto scrollbar-hide will-change-scroll">
            <ScrollToTop />
            {children}
          </main>

          <div className="shrink-0 lg:hidden">
            <MobileDock />
          </div>
        </div>

        <Toaster
          position="top-right"
          closeButton
          toastOptions={{
            duration: 4000,
          }}
        />
        <SpeedInsights />
        <Analytics />
      </div>
    </div>
  );
}
