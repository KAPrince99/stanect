import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button, buttonVariants } from "@/components/ui/button";

function renderButton(props: React.ComponentProps<typeof Button> = {}) {
  render(<Button {...props}>Go</Button>);
  return screen.getByRole("button", { name: "Go" });
}

describe("Button variants", () => {
  it("primary is an amber-to-orange pill with the brand hover", () => {
    const button = renderButton({ variant: "primary" });

    expect(button).toHaveClass(
      "rounded-full",
      "bg-linear-to-r",
      "from-brand-from",
      "to-brand-to",
      "text-black",
      "hover:from-brand-from-hover",
      "hover:to-brand-to-hover",
    );
  });

  it("success is a green pill, separate from the brand color", () => {
    const button = renderButton({ variant: "success" });

    expect(button).toHaveClass(
      "rounded-full",
      "from-success-from",
      "to-success-to",
    );
    expect(button).not.toHaveClass("from-brand-from");
  });

  it("danger is a red pill with white text", () => {
    const button = renderButton({ variant: "danger" });

    expect(button).toHaveClass(
      "rounded-full",
      "bg-danger",
      "text-white",
      "hover:bg-danger-hover",
    );
  });

  it("secondary is a quiet glass pill", () => {
    const button = renderButton({ variant: "secondary" });

    expect(button).toHaveClass(
      "rounded-full",
      "border-white/20",
      "bg-white/5",
      "text-white",
    );
  });

  it("glass is a round icon-button surface", () => {
    const button = renderButton({ variant: "glass", size: "icon" });

    expect(button).toHaveClass("rounded-full", "bg-white/8", "backdrop-blur-md");
  });

  it("keeps the old default look when no variant is given", () => {
    const button = renderButton();

    expect(button).toHaveClass("bg-primary", "rounded-md", "h-9");
    expect(button).not.toHaveClass("rounded-full");
  });
});

describe("Button sizes", () => {
  it.each([
    ["sm", "h-9"],
    ["md", "h-11"],
    ["lg", "h-12"],
  ] as const)("%s is %s tall", (size, height) => {
    expect(renderButton({ size })).toHaveClass(height);
  });

  it("keeps the icon size", () => {
    expect(renderButton({ size: "icon" })).toHaveClass("size-9");
  });
});

describe("Button overrides", () => {
  it("lets a className replace the variant's radius and height", () => {
    const button = renderButton({
      variant: "primary",
      size: "lg",
      className: "rounded-xl h-10",
    });

    expect(button).toHaveClass("rounded-xl", "h-10");
    expect(button).not.toHaveClass("rounded-full");
    expect(button).not.toHaveClass("h-12");
  });

  it("works on a link through asChild", () => {
    render(
      <Button asChild variant="primary" size="md">
        <a href="#open">Open</a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Open" });
    expect(link).toHaveAttribute("href", "#open");
    expect(link).toHaveClass("rounded-full", "h-11");
  });

  it("buttonVariants gives the same classes for non-button elements", () => {
    const classes = buttonVariants({ variant: "danger", size: "md" });

    expect(classes).toContain("bg-danger");
    expect(classes).toContain("h-11");
  });
});

describe("Brand tokens", () => {
  const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");
  const source = readFileSync(
    join(process.cwd(), "components/ui/button.tsx"),
    "utf8",
  );

  it("defines every brand color the variants use", () => {
    const used = new Set(
      [...source.matchAll(/(?:from|to|bg)-((?:brand|success|danger)[\w-]*)/g)].map(
        (match) => match[1],
      ),
    );

    expect(used.size).toBeGreaterThan(0);
    for (const token of used) {
      expect(css, `missing --color-${token}`).toContain(`--color-${token}:`);
    }
  });
});
