"use client";

import Pill from "./pill";

export default function Navbar() {
  return (
    <nav className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-center p-4">
      <div className="pointer-events-auto w-[min(100%,56rem)] px-4">
        <Pill />
      </div>
    </nav>
  );
}
