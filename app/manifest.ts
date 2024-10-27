import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Quratr",
    short_name: "Quratr",
    description: "Quratr - Your ultimate platform for curated experiences.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "16x16, 32x32, 48x48, 64x64",
        type: "image/x-icon",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    display_override: ["window-controls-overlay", "standalone", "browser"],
    shortcuts: [
      {
        name: "Swipe to vibe",
        short_name: "Discover",
        url: "/app/experience/discover",
        icons: [{ src: "/assests/shortcuts/swipe.svg", sizes: "24x24" }],
      },
      {
        name: "Your Curations",
        short_name: "Curations",
        url: "/app/experience/curated",
        icons: [{ src: "/assests/shortcuts/curations.svg", sizes: "24x24" }],
      },
      {
        name: "Feed",
        short_name: "Feed",
        url: "/app/feed",
        icons: [{ src: "/assests/shortcuts/feed.svg", sizes: "24x24" }],
      },
      {
        name: "New Post",
        short_name: "Post",
        url: "/app/feed/new",
        icons: [{ src: "/assests/shortcuts/post.svg", sizes: "24x24" }],
      },
      {
        name: "Profile",
        short_name: "Profile",
        url: "/app/profile",
        icons: [{ src: "/assests/shortcuts/profile.svg", sizes: "24x24" }],
      },
    ],
    orientation: "portrait",
    prefer_related_applications: false,
    categories: ["social", "entertainment", "lifestyle", "personalization"],
  };
}
