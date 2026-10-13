"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

import { BRAND } from "@/lib/brand";

/** Shared by every toast: a compact pill, same shape as the buttons. */
export const toastSurfaceClass =
  "toast group flex items-center gap-2 rounded-full border border-white/15 bg-black px-4 py-2.5 text-white shadow-none";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: toastSurfaceClass,
          title: "type-meta font-medium text-white",
          description: "hidden",
          actionButton:
            "rounded-full !bg-linear-to-r !from-brand-from !to-brand-to !text-black hover:!from-brand-from-hover hover:!to-brand-to-hover",
          cancelButton: "rounded-full !bg-white/10 !text-white hover:!bg-white/20",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "#000000",
          "--normal-text": BRAND.white,
          "--normal-border": "rgba(255, 255, 255, 0.15)",
          "--border-radius": "9999px",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
