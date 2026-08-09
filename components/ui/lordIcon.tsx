// @ts-nocheck

"use client";

interface LordIconProps {
  src: string;
  trigger?: "hover" | "click" | "loop" | "morph" | "boomerang";
  state?: string;
  width?: number | string;
  height?: number | string;
  colors?: string;
  className?: string;
  loading?: "lazy" | "interaction" | "delay";
}

/** Renders a Lordicon. Script is loaded once from the app layout. */
export default function LordIcon({
  src,
  trigger = "hover",
  state,
  width = 150,
  height = 150,
  colors,
  className,
  loading = "lazy",
}: LordIconProps) {
  return (
    <lord-icon
      src={src}
      trigger={trigger}
      state={state}
      colors={colors}
      loading={loading}
      style={{ width, height }}
      className={className}
    />
  );
}
