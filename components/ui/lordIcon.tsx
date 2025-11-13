"use client";

import { useEffect } from "react";
import Script from "next/script";

interface LordIconProps {
  src: string;
  trigger?: "hover" | "click" | "loop";
  state?: string;
  width?: number | string;
  height?: number | string;
  colors?: string;
  className?: string;
}

export default function LordIcon({
  src,
  trigger = "hover",
  state,
  width = 150,
  height = 150,
  colors,
  className,
}: LordIconProps) {
  // Ensure the script loads once
  useEffect(() => {
    if (
      !document.querySelector(
        'script[src="https://cdn.lordicon.com/lordicon.js"]'
      )
    ) {
      const script = document.createElement("script");
      script.src = "https://cdn.lordicon.com/lordicon.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <>
      {/* Load the Lordicon library safely */}
      <Script
        src="https://cdn.lordicon.com/lordicon.js"
        strategy="afterInteractive"
      />

      {/* Render the Lordicon */}
      <lord-icon
        src={src}
        trigger={trigger}
        state={state}
        colors={colors}
        style={{ width, height }}
        className={className}
      ></lord-icon>
    </>
  );
}
