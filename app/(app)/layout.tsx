// app/layout.tsx (or wherever your root layout lives)
import MobileDock from "@/components/ui/mobileDock";
import Navbar from "@/components/ui/navbar";
import Sidebar from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "@/app/globals.css";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="en" className="h-full">
      <div className="h-full bg-black text-white overflow-hidden antialiased">
        {/* Global Gradient Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b1a36] via-[#1a3a80] to-[#1e4ea8]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Animated Orbs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="flex h-screen overflow-hidden">
          {/* Desktop Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col relative overflow-hidden">
            {/* Top Navbar */}
            <Navbar />

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto scrollbar-hide pb-24 lg:pb-0">
              {children}
            </main>

            {/* Mobile Dock */}
            <MobileDock />
          </div>
        </div>

        {/* Toast Notifications — Now Sexy */}
        <Toaster
          position="top-right"
          closeButton
          richColors
          toastOptions={{
            style: {
              background: "rgba(15, 23, 42, 0.95)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "white",
              borderRadius: "1.5rem",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
              fontWeight: "600",
            },
            duration: 4000,
          }}
        />

        {/* Performance */}
        <SpeedInsights />
        <Analytics />
      </div>
    </div>
  );
}
