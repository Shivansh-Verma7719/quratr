// app/components/ThemeSwitcher.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeSwitcher({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`${className ? className : "fixed top-4 right-4"}`}>
      <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full bg-white dark:bg-gray-800 text-white transition duration-300 ease-in-out transform hover:scale-110"
      >
      {theme === "dark" ? <Sun size={24} /> : <Moon size={24} fill="black" />}
      </button>
    </div>
  );
}
