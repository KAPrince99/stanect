export function InfoItem({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 p-4 md:p-5 rounded-xl transition-all duration-300 ${
        highlight
          ? "bg-amber-900/20 border border-amber-600/30"
          : "bg-gray-700/40 border border-gray-700/50"
      }`}
    >
      <div
        className={`p-3 rounded-lg bg-gray-800/50 ${
          highlight ? "text-amber-400" : "text-gray-400"
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-wider">
          {label}
        </p>
        <p className="text-md md:text-lg font-bold text-white mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}
