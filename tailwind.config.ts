import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class", // Ensure class-based dark mode is enabled
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        text: "var(--color-text)",
        textSec: "var(--color-text-secondary)",
        /* Add more colors as needed */
      },
      keyframes: {
        // Updated faster left-to-right only animation
        "slow-shimmer": {
          "0%": {
            "background-position": "calc(-100% - var(--shiny-width)) 0",
          },
          "100%": {
            "background-position": "calc(100% + var(--shiny-width)) 0",
          },
        },
      },
      animation: {
        "slow-shimmer":
          "slow-shimmer 2.5s cubic-bezier(0.45, 0, 0.25, 1) infinite",
      },
    },
  },
  plugins: [typography, heroui()],
};
export default config;
