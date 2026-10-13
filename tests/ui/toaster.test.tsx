import { describe, expect, it } from "vitest";

import { toastSurfaceClass } from "@/components/ui/sonner";

describe("toasts", () => {
  it("are a pill, the same shape as the buttons", () => {
    expect(toastSurfaceClass).toContain("rounded-full");
  });

  it("stay compact: no heavy shadow, no extra bounce chrome", () => {
    expect(toastSurfaceClass).toContain("shadow-none");
    expect(toastSurfaceClass).toContain("px-4");
    expect(toastSurfaceClass).toContain("py-2.5");
    expect(toastSurfaceClass).not.toContain("rounded-2xl");
  });

  it("is black", () => {
    expect(toastSurfaceClass).toContain("bg-black");
  });
});
