"use client";

import Pill from "./pill";

export default function Navbar() {
  return (
    <nav className="pointer-events-none absolute inset-x-0 top-0 z-50 flex items-center justify-center p-4">
      <div className="pointer-events-auto w-full max-w-xl">
        <Pill />
      </div>
    </nav>
  );
}
