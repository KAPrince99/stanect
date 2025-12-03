"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // When the pathname changes (i.e., you navigate to a new page),
    // force the window to scroll instantly to the top (0, 0).
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // This component doesn't render anything
}
