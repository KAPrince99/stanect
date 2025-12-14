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
    theme_color: "#0b1a36",
    orientation: "portrait-primary", // Added from the JSON file
    scope: "/", // Added from the JSON file
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable", // Good practice to include 'any'
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
      // You may want to add 384x384, 256x256, 144x144, and 96x96 versions too for full coverage
    ],
  };
}
