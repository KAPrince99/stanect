import Image from "next/image";
import Link from "next/link";

export function NavbarLogo() {
  return (
    <Link
      href="/"
      className="-ml-2 flex select-none items-center justify-center focus:outline-transparent focus:ring-transparent active:outline-transparent"
    >
      <Image
        src="/logo/logo.svg"
        alt="Stanect"
        width={35}
        height={35}
        className="object-contain"
      />
      <span className="bg-linear-to-r from-white to-white/80 bg-clip-text text-xl font-display tracking-tighter text-transparent">
        stanect
      </span>
    </Link>
  );
}
