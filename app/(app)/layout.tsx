import Navbar from "@/components/ui/navbar";
import Sidebar from "@/components/ui/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <div className="flex flex-col flex-1 overflow-y-auto scrollbar-hide ">
        <Navbar />
        <main>{children}</main>
      </div>
      <Sidebar />
    </div>
  );
}
