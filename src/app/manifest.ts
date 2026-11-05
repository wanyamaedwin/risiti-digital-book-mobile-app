import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Risiti Digital Book",
    short_name: "Risiti",
    description: "A fresh page for your everyday business.",
    lang: "en",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#EEEEED",
    theme_color: "#1E1A34",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
