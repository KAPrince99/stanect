import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center p-10 ">
      <Link href="/">
        <Image src="/logo/logo.svg" alt="logo" height={35} width={35} />
      </Link>
      <SignIn />
    </main>
  );
}
