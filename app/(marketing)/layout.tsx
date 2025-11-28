import { ReactNode } from "react";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen relative bg-gradient-to-br  from-[#0b1a36] via-[#0f2a5c] to-[#1e4ea8] text-white overflow-y-auto">
      {children}
    </div>
  );
}
