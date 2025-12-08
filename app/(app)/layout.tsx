import MobileDock from "@/components/ui/mobileDock";
import Navbar from "@/components/ui/navbar";
import Sidebar from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { ReactNode } from "react";
import ScrollToTop from "@/components/ui/ScrollToTop";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div lang="en" className="h-full w-screen">
      <div className="h-full text-white antialiased">
        {/*Global Background*/}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-linear-to-br from-[#0b1a36] via-[#1a3a80] to-[#1e4ea8]" />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/*  Content Wrapper */}
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <div className="hidden lg:flex shrink-0">
            <Sidebar />
          </div>

          {/* Right-hand Content Area  */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Navbar*/}
            <Navbar />

            {/* Main Content Area */}
            <main
              className="flex-1 overflow-y-auto scrollbar-hide 
                         pb-0 lg:pb-0 will-change-scroll"
            >
              <ScrollToTop />
              {children}
            </main>

            {/* Mobile Dock */}
            <div className="lg:hidden shrink-0">
              <MobileDock />
            </div>
          </div>
        </div>
        <Toaster
          position="top-right"
          closeButton
          richColors
          toastOptions={{
            style: {
              background: "rgba(15, 23, 42, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "white",
              borderRadius: "1.5rem",
              boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
              fontWeight: "600",
              backdropFilter: "blur(6px)",
            },
            duration: 4000,
          }}
        />
        <SpeedInsights />
        <Analytics />
      </div>
    </div>
  );
}
