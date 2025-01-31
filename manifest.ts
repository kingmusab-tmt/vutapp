import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SABAMU ENTERPRISE",
    short_name: "SABAMUENT",
    description: "AIRTIME, DATA, TV SUBSCRIPTION, ELECTRICITY BILL PAYMENT",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
