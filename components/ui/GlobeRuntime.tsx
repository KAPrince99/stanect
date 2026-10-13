"use client";

import dynamic from "next/dynamic";
import { useLayoutEffect, useRef, type RefObject } from "react";
import { create } from "zustand";

import { useConvoStore } from "@/store/use-convo-store";

const GlobeCanvas = dynamic(() => import("./GlobeCanvas"), { ssr: false });

type GlobeRuntimeState = {
  slot: HTMLElement | null;
  painted: boolean;
  booted: boolean;
  setSlot: (slot: HTMLElement | null) => void;
  markPainted: () => void;
  reset: () => void;
};

export const useGlobeRuntime = create<GlobeRuntimeState>((set) => ({
  slot: null,
  painted: false,
  booted: false,
  setSlot: (slot) =>
    set((state) => ({
      slot,
      booted: state.booted || Boolean(slot),
    })),
  markPainted: () => set({ painted: true }),
  reset: () => set({ slot: null, painted: false, booted: false }),
}));

/** The call page registers the hole the globe should sit in. */
export function useGlobeSlot(ref: RefObject<HTMLElement | null>) {
  const setSlot = useGlobeRuntime((state) => state.setSlot);

  useLayoutEffect(() => {
    setSlot(ref.current);
    return () => setSlot(null);
  }, [ref, setSlot]);
}

/**
 * One WebGL globe for the whole app session. First visit creates it;
 * leaving the call page only parks it off-screen so coming back is instant.
 */
export function GlobeRuntime() {
  const slot = useGlobeRuntime((state) => state.slot);
  const booted = useGlobeRuntime((state) => state.booted);
  const markPainted = useGlobeRuntime((state) => state.markPainted);
  const isCallLive = useConvoStore((state) => state.callStatus === "ACTIVE");
  const hostRef = useRef<HTMLDivElement>(null);
  const lastSize = useRef({ width: 256, height: 256 });

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Keep the last on-screen size. Shrinking to 1px rebuilds the WebGL
    // buffer and looks like a remount when you come back.
    const park = () => {
      host.style.visibility = "hidden";
      host.style.pointerEvents = "none";
      host.style.position = "fixed";
      host.style.left = "0px";
      host.style.top = "0px";
      host.style.width = `${lastSize.current.width}px`;
      host.style.height = `${lastSize.current.height}px`;
      host.style.transform = "translate3d(-200vw, -200vh, 0)";
      host.style.zIndex = "-1";
      host.setAttribute("aria-hidden", "true");
    };

    if (!slot) {
      park();
      return;
    }

    const sync = () => {
      const box = slot.getBoundingClientRect();
      if (box.width > 0 && box.height > 0) {
        lastSize.current = { width: box.width, height: box.height };
      }
      host.style.visibility = "visible";
      host.style.pointerEvents = "none";
      host.style.position = "fixed";
      host.style.left = `${box.left}px`;
      host.style.top = `${box.top}px`;
      host.style.width = `${box.width}px`;
      host.style.height = `${box.height}px`;
      host.style.transform = "none";
      host.style.zIndex = "15";
      host.removeAttribute("aria-hidden");
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(slot);
    window.addEventListener("scroll", sync, true);
    window.addEventListener("resize", sync);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", sync, true);
      window.removeEventListener("resize", sync);
    };
  }, [slot]);

  if (!booted) return null;

  return (
    <div
      ref={hostRef}
      data-globe-runtime
      className="overflow-hidden"
      style={{ position: "fixed", visibility: "hidden" }}
    >
      <GlobeCanvas
        isCallLive={isCallLive}
        awake={Boolean(slot)}
        onReady={markPainted}
      />
    </div>
  );
}
