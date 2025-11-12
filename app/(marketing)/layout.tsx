import { ReactNode } from "react";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex justify-center items-center">
      {children}
    </div>
  );
}
