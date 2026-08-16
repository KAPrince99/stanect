import Link from "next/link";

export default function PillBrand() {
  return (
    <Link
      href="/"
      className="group z-10 flex items-center no-underline outline-none focus:outline-none"
    >
      <div className="type-brand">
        <span className="bg-linear-to-r from-white via-white/90 to-white/50 bg-clip-text text-transparent">
          Stanect
        </span>
      </div>
    </Link>
  );
}
