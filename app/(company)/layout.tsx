import { ReactNode } from "react";

export default function CompanyLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-black text-white antialiased">{children}</div>;
}
