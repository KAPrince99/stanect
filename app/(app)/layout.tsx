import { GlobeRuntime } from "@/components/ui/GlobeRuntime";
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
          <div className="absolute inset-0 bg-linear-to-br from-backdrop-from via-backdrop-via to-backdrop-to" />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Dashboard, conversation, and pricing share the column beside the sidebar. */}
        <Navbar />

        <div className="pointer-events-none fixed inset-y-0 left-0 z-40 hidden lg:block">
          <div className="pointer-events-auto h-full">
            <Sidebar />
          </div>
        </div>

        <div className="flex h-screen flex-col overflow-hidden">
          <main className="flex min-h-0 flex-1 flex-col overflow-y-auto scrollbar-hide will-change-scroll">
            <ScrollToTop />
            {children}
          </main>

          <div className="shrink-0 lg:hidden">
            <MobileDock />
          </div>
        </div>

        <GlobeRuntime />

        <Toaster
          position="bottom-right"
          offset={{ bottom: "1.5rem", right: "1.5rem" }}
          mobileOffset={{ bottom: "6rem", right: "1rem" }}
          toastOptions={{ duration: 4000 }}
        />
        <SpeedInsights />
        <Analytics />
      </div>
    </div>
  );
}
