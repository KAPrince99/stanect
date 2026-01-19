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
      className={`flex items-center gap-4 p-4 md:p-5 rounded-xl transition-all duration-300  bg-transparent border-2 border-white/20 `}
    >
      <div
        className={`p-3 rounded-lg bg-white/10 border-2 border-white/20 ${
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
