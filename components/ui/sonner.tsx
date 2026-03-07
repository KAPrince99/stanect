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

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "toast group rounded-2xl border border-white/12 bg-[#0b1a36]/90 text-white shadow-[0_20px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl",
          title: "text-white font-semibold tracking-tight",
          description: "text-white/75",
          actionButton:
            "!bg-linear-to-r !from-amber-400 !to-orange-500 !text-black hover:!from-amber-500 hover:!to-orange-600",
          cancelButton: "!bg-white/10 !text-white hover:!bg-white/20",
          closeButton:
            "!bg-transparent !border-white/20 !text-white/65 hover:!text-white hover:!border-white/30",
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
          "--normal-bg": "rgba(11, 26, 54, 0.92)",
          "--normal-text": "#ffffff",
          "--normal-border": "rgba(255, 255, 255, 0.12)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
