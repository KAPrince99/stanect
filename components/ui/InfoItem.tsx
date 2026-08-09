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
      className={`grid grid-cols-[50px_3fr] items-center gap-4 p-2 md:p-5 rounded-xl transition-all duration-300  bg-transparent border-2 border-white/20 `}
    >
      <div className={`p-3 `}>{icon}</div>
      <div>
        <p className="type-meta uppercase tracking-wider">
          {label}
        </p>
        <p className="type-label mt-0.5 text-base text-white">
          {value}
        </p>
      </div>
    </div>
  );
}
