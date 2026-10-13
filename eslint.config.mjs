import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Design-system guardrails for app code. Tests and lib/brand.ts are exempt.
// A genuine exception gets `// eslint-disable-next-line no-restricted-syntax -- why`.
const HEX = "#[0-9a-fA-F]{3,8}\\b";

const designSystemRules = [
  {
    selector: "JSXOpeningElement[name.name='button']",
    message:
      "Use <Button> from @/components/ui/button. Text links and segmented controls may disable this rule with a reason.",
  },
  {
    selector: `Literal[value=/${HEX}/]`,
    message:
      "No hex colors in components. Use a theme token (brand-*, backdrop-*) or BRAND / lordColors from @/lib/brand.",
  },
  {
    selector: `TemplateElement[value.raw=/${HEX}/]`,
    message:
      "No hex colors in components. Use a theme token (brand-*, backdrop-*) or BRAND / lordColors from @/lib/brand.",
  },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": ["error", ...designSystemRules],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
