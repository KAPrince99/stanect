import Image from "next/image";
import Link from "next/link";

export default async function Homepage() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-2">
      <Image
        src="/avatars/happy_friends.jpg"
        alt="logo"
        height={600}
        width={600}
      />

      <Link href="/dashboard">
        <button className="bg-blue-400  rounded-md text-white cursor-pointer px-5 py-1">
          Get Started
        </button>
      </Link>
    </div>
  );
}
