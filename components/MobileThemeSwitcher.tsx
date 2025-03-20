"use client";
import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "@heroui/react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

interface MobileThemeSwitcherProps {
  className?: string;
}

export const MobileThemeSwitcher = ({ className = "" }: MobileThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<string>(theme || "system");

  useEffect(() => {
    if (theme) {
      setSelectedTheme(theme);
    }
  }, [theme]);

  const handleThemeChange = (key: React.Key) => {
    if (typeof key === "string") {
      setTheme(key);
    }
  };

  return (
    <Tabs
      selectedKey={selectedTheme}
      onSelectionChange={handleThemeChange}
      aria-label="Theme options"
      color="primary"
      size="sm"
      variant="bordered"
      className={`text-default-600 ${className}`}
      radius="full"
    >
      <Tab
        key="light"
        title={
          <div className="flex items-center gap-1">
            <Sun size={16} />
            <span>Light</span>
          </div>
        }
      />
      <Tab
        key="system"
        title={
          <div className="flex items-center gap-1">
            <Monitor size={16} />
            <span>System</span>
          </div>
        }
      />
      <Tab
        key="dark"
        title={
          <div className="flex items-center gap-1">
            <Moon size={16} />
            <span>Dark</span>
          </div>
        }
      />
    </Tabs>
  );
};