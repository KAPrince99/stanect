import React, { ReactNode } from "react";

export default function Authlayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1a36] via-[#1a3a80] to-[#1e4ea8]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>
      {children}
    </div>
  );
}
