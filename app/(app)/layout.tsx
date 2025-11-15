import MobileDock from "@/components/ui/mobileDock";
import Navbar from "@/components/ui/navbar";
import Sidebar from "@/components/ui/sidebar";
const icons = [
  { src: "https://cdn.lordicon.com/pgirtdfe.json", id: 1, href: "/dashboard" },
  { src: "https://cdn.lordicon.com/ytklkgsc.json", id: 2, href: "/pricing" },
  { src: "https://cdn.lordicon.com/ueoydrft.json", id: 3, href: "/new" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
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
    </div>
  );
}
