"use client";

import React from "react";
import Link from "next/link";
import useScrollingEffect from "@/hook/use-scroll";
import { useTheme } from "next-themes";
import { BottomPages } from "../pages";

const BottomNav = () => {
  const scrollDirection = useScrollingEffect(); // Use the custom hook
  const navClass = scrollDirection === "up" ? "" : "opacity-25 duration-500";
  const pages = BottomPages();
  const { theme } = useTheme();

  return (
    <div
      className={`fixed bottom-0 w-full py-4 z-10 bg-background border-t border-zinc-200 shadow-lg sm:hidden ${navClass}`}
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