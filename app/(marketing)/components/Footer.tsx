import { Github, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-transparent text-white py-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="text-xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-white via-white/90 to-white/50 bg-clip-text text-transparent">
            Stanect
          </span>
        </div>

        {/* Quick links */}
        <div className="flex gap-6 text-sm md:text-base">
          <Link
            href="#features"
            className="hover:text-cyan-300 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="hover:text-cyan-300 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#contact"
            className="hover:text-cyan-300 transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/company"
            className="hover:text-cyan-300 transition-colors"
          >
            About
          </Link>
        </div>

        {/* Socials */}
        <div className="flex gap-4">
          <Link
            href="https://twitter.com"
            className="hover:text-cyan-300 transition-colors"
          >
            <Twitter className="w-5 h-5" />
          </Link>
          <Link
            href="https://github.com"
            className="hover:text-white/80 transition-colors"
          >
            <Github className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="mt-6 text-center text-white/50 text-sm">
        © {new Date().getFullYear()} Stanect. All rights reserved.
      </div>
    </footer>
  );
}
