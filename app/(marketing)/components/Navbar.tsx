"use client";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button"; // assuming you're using shadcn or similar
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUser } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn } = useUser();
  const navLinks = [
    { name: "Demo", href: "/#demo" },
    { name: "Scenarios", href: "/#scenarios" },
    { name: "Pricing", href: "/#pricing" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 py-4">
      <div className="container mx-auto px-6 md:px-8">
        <div
          className="flex h-16 items-center justify-between 
                        backdrop-blur-xl bg-white/5 border border-white/10 
                        rounded-full px-6 md:px-8 shadow-2xl shadow-black/20"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center -ml-2">
            <Image
              src="/logo/logo.svg"
              alt="Stanect"
              width={48}
              height={48}
              className="object-contain"
            />
            <span
              className="ml-1 text-2xl font-black tracking-tighter 
                             bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
            >
              tanect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-white/80 hover:text-white font-medium 
                           transition-all duration-300 hover:scale-105"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Desktop CTA */}
            <Button
              asChild
              size="lg"
              className="hidden md:flex bg-gradient-to-r from-amber-400 to-amber-500 
                         hover:from-amber-500 hover:to-amber-600 
                         text-black font-bold shadow-lg hover:shadow-amber-500/50 
                         transition-all duration-300 hover:scale-105"
            >
              <Link href="/dashboard">Start For Free</Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-white hover:bg-white/10"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-gradient-to-b from-[#0b1a36] to-[#1e4ea8] border-white/10"
              >
                <div className="flex flex-col gap-8 mt-10">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-2xl font-medium text-white/90 hover:text-white transition"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div>
                    {!isSignedIn && (
                      <Button
                        asChild
                        size="lg"
                        className="mt-6 bg-gradient-to-r from-amber-400 to-amber-500 
                     hover:from-amber-500 hover:to-amber-600 
                     text-black font-bold"
                      >
                        <Link href="/login">Start For Free</Link>
                      </Button>
                    )}

                    {isSignedIn && (
                      <Button
                        asChild
                        size="lg"
                        className="mt-6 bg-gradient-to-r from-amber-400 to-amber-500 
                     hover:from-amber-500 hover:to-amber-600 
                     text-black font-bold"
                      >
                        <Link href="/dashboard">Dashboard</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
