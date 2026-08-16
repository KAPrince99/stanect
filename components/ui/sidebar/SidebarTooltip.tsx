interface SidebarTooltipProps {
  label: string;
}

export default function SidebarTooltip({ label }: SidebarTooltipProps) {
  return (
    <div className="pointer-events-none absolute top-1/2 left-full -ml-2 -translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
      <div className="type-meta whitespace-nowrap rounded-full bg-white/10 px-2 py-1 text-white shadow-2xl backdrop-blur">
        {label}
      </div>
    </div>
  );
}
