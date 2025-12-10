import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Stanect",
    short_name: "Stanect",
    description:
      "An AI-powered voice companion that helps you build confidence and communicate better",
    start_url: "/",
    display: "standalone",
    background_color: "#0b1a36",
    theme_color: "#1a3a80",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
