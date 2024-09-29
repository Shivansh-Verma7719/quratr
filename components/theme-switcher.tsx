// app/components/ThemeSwitcher.tsx
"use client";
import { Switch } from "@nextui-org/switch";
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
    <div className={`${className ? className : "fixed top-[1.1rem] right-2"}`}>
      <Switch
        defaultSelected={theme === "dark"}
        size="lg"
        color="primary"
        onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
        thumbIcon={({ isSelected, className }) =>
          isSelected ? (
            <Moon className={className} />
          ) : (
            <Sun className={className} />
          )
        }
      >
      </Switch>
    </div>
  );
}
