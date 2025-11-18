import MobileDock from "@/components/ui/mobileDock";
import Navbar from "@/components/ui/navbar";
import Sidebar from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
const icons = [
  { src: "https://cdn.lordicon.com/pgirtdfe.json", id: 1, href: "/dashboard" },
  { src: "https://cdn.lordicon.com/ytklkgsc.json", id: 2, href: "/pricing" },
  { src: "https://cdn.lordicon.com/ueoydrft.json", id: 3, href: "/new" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex h-screen overflow-hidden"
      data-scroll-behavior="smooth"
    >
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-y-auto scrollbar-hide ">
        <Navbar />
        <main>
          {children}
          <div>
            <MobileDock icons={icons} />
          </div>
        </main>
      </div>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            background: "linear-gradient(135deg,#0072c3,#004cff95])",
            borderRadius: "1rem",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            fontWeight: 500,
            padding: "0.75rem 1.25rem",
          },
        }}
      />
    </div>
  );
}
