import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Homepage() {
  return (
    <div className="flex items-center justify-center gap-2">
      <Image
        src="/avatars/happy_friends.jpg"
        alt="logo"
        height={600}
        width={600}
      />
      <div>
        {/* <h1 className="text-5xl font-semibold text-gray-600 ">Stanect</h1> */}
        <Link href="/dashboard">
          <button className="bg-blue-400 p-2 rounded-md text-white cursor-pointer">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}
