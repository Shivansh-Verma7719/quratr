"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { BottomPages } from "../pages";

const BottomNav = () => {
  const pages = BottomPages();
  const { theme } = useTheme();

  return (
    <div
      className={`fixed bottom-0 w-full py-2 z-10 bg-background shadow-lg sm:hidden`}
    >
      <div className="flex flex-row justify-around items-center bg-transparent w-full">
        {pages.map((page, index) => (
          <Link key={index} href={page.href} className="flex items-center">
            {page.active ? (
              <page.icon
                width="32"
                height="32"
                stroke={theme === "dark" ? "white" : "black"}
              />
            ) : (
              <page.icon width="32" height="32" stroke="gray" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
