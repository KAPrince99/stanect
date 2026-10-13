import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { BRAND, ICON_COLORS, lordColors } from "@/lib/brand";

const css = readFileSync(
  path.resolve(__dirname, "../../app/globals.css"),
  "utf8",
);

function cssToken(name: string): string {
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{3,8})`));
  if (!match) throw new Error(`--color-${name} not found as a hex in globals.css`);
  return match[1].toLowerCase();
}

describe("brand constants stay in sync with the CSS theme tokens", () => {
  it.each([
    ["backdrop-from", BRAND.backdropFrom],
    ["backdrop-via", BRAND.backdropVia],
    ["backdrop-via-deep", BRAND.backdropViaDeep],
    ["backdrop-to", BRAND.backdropTo],
    ["brand-accent", BRAND.accent],
  ])("--color-%s matches lib/brand.ts", (token, value) => {
    expect(cssToken(token)).toBe(value.toLowerCase());
  });

  it("icon accent and navy reuse the brand colors", () => {
    expect(ICON_COLORS.accent).toBe(BRAND.accent);
    expect(ICON_COLORS.navy).toBe(BRAND.backdropVia);
  });
});

describe("lordColors", () => {
  it("builds a Lordicon colors string from named palette entries", () => {
    expect(lordColors({ primary: "white", secondary: "accent" })).toBe(
      `primary:${ICON_COLORS.white},secondary:${ICON_COLORS.accent}`,
    );
  });
});
