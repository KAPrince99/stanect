/**
 * Brand colors for places CSS classes can't reach: animated icons, toast
 * styles, confetti, and metadata. Class-based styling uses the theme tokens in
 * `app/globals.css` (`brand-*`, `backdrop-*`); a test keeps both in sync.
 */
export const BRAND = {
  /** Page backdrop gradient, top-left to bottom-right. */
  backdropFrom: "#0b1a36",
  backdropVia: "#1a3a80",
  backdropTo: "#1e4ea8",
  /** Slightly deeper middle stop used on the marketing pages. */
  backdropViaDeep: "#0f2a5c",
  /** Orange used for icons, progress fills and highlights. */
  accent: "#e88c30",
  white: "#ffffff",
  /** Toast error background. */
  toastError: "#ff4d4f",
  confetti: ["#fbbf24", "#f59e0b", "#ffffff"],
} as const;

/** Colors available to Lordicon animations, by name. */
export const ICON_COLORS = {
  accent: BRAND.accent,
  white: BRAND.white,
  black: "#000000",
  cream: "#ebe6ef",
  gold: "#ffc738",
  slate: "#646e78",
  flame: "#f24c00",
  sky: "#4bb3fd",
  navy: BRAND.backdropVia,
  danger: "#e83a30",
} as const;

type IconColorName = keyof typeof ICON_COLORS;
type IconColorSlot =
  | "primary"
  | "secondary"
  | "tertiary"
  | "quaternary"
  | "quinary";

/**
 * Builds a Lordicon `colors` string from named colors:
 * `lordColors({ primary: "accent", secondary: "white" })`
 * gives `"primary:#e88c30,secondary:#ffffff"`.
 */
export function lordColors(
  colors: Partial<Record<IconColorSlot, IconColorName>>,
): string {
  return Object.entries(colors)
    .map(([slot, name]) => `${slot}:${ICON_COLORS[name as IconColorName]}`)
    .join(",");
}
