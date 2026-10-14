import Image from "next/image";
import Link from "next/link";

export default function PillBrand() {
  return (
    <Link
      href="/"
      aria-label="Stanect"
      className="group z-10 flex items-center no-underline outline-none focus:outline-none"
    >
      <Image
        src="/logo/logo.svg"
        alt=""
        width={36}
        height={36}
        className="size-8 object-contain sm:size-9"
      />
    </Link>
  );
}
