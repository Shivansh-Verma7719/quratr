import { nextui } from "@nextui-org/theme";
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Ensure class-based dark mode is enabled
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
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
        bounceHorizontal: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(10px)" },
        },
      },
      animation: {
        bounceHorizontal: "bounceHorizontal 1s infinite",
      },
    },
  },
 plugins: [require("@tailwindcss/typography"), nextui()],
};
export default config;
