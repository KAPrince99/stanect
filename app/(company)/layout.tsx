import React, { ReactNode } from "react";

export default function ComapnyLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen bg-black text-white overflow-y-auto p-5 md:p-10 ">
      {children}
    </div>
  );
}
