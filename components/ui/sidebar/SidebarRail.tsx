import SidebarBrandMark from "./SidebarBrandMark";
import SidebarNavItems from "./SidebarNavItems";
import SidebarProfileLink from "./SidebarProfileLink";

export default function SidebarRail() {
  return (
    <div className="flex h-full flex-col items-center justify-start py-40">
      <div className="relative">
        <div className="relative flex flex-col items-center gap-8 rounded-full border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
          <SidebarNavItems />
          <SidebarProfileLink />
        </div>
      </div>

      <SidebarBrandMark />
    </div>
  );
}
