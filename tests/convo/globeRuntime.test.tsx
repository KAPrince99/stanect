import { render, waitFor } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  GlobeRuntime,
  useGlobeRuntime,
  useGlobeSlot,
} from "@/components/ui/GlobeRuntime";

vi.mock("@/components/ui/GlobeCanvas", () => ({
  default: () => <canvas data-testid="globe-canvas" />,
}));

function CallPageSlot() {
  const ref = useRef<HTMLDivElement>(null);
  useGlobeSlot(ref);
  return <div ref={ref} data-testid="globe-slot" />;
}

describe("globe runtime cache", () => {
  beforeEach(() => {
    useGlobeRuntime.getState().reset();
  });

  afterEach(() => {
    useGlobeRuntime.getState().reset();
  });

  it("stays painted after the call page slot is cleared", () => {
    useGlobeRuntime.getState().markPainted();
    useGlobeRuntime.getState().setSlot(null);

    expect(useGlobeRuntime.getState().painted).toBe(true);
  });

  it("stays booted after the call page slot is cleared", () => {
    const slot = document.createElement("div");
    useGlobeRuntime.getState().setSlot(slot);
    useGlobeRuntime.getState().setSlot(null);

    expect(useGlobeRuntime.getState().booted).toBe(true);
    expect(useGlobeRuntime.getState().slot).toBeNull();
  });

  it("keeps the same globe host after the call page unmounts", async () => {
    function App({ showSlot }: { showSlot: boolean }) {
      return (
        <>
          {showSlot ? <CallPageSlot /> : null}
          <GlobeRuntime />
        </>
      );
    }

    const view = render(<App showSlot />);

    await waitFor(() => {
      expect(useGlobeRuntime.getState().booted).toBe(true);
    });

    const host = document.querySelector("[data-globe-runtime]");
    expect(host).not.toBeNull();

    view.rerender(<App showSlot={false} />);

    expect(useGlobeRuntime.getState().booted).toBe(true);
    expect(useGlobeRuntime.getState().slot).toBeNull();
    expect(document.querySelector("[data-globe-runtime]")).toBe(host);
    expect(host).toHaveStyle({
      visibility: "hidden",
      transform: "translate3d(-200vw, -200vh, 0)",
    });
  });
});
