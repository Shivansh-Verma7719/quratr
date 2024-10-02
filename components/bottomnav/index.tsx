"use client";

import React from "react";
import Link from "next/link";
import useNavigation from "@/hook/use-navigation";
import useScrollingEffect from "@/hook/use-scroll";
import { Home, DoorOpen, Newspaper, BadgePlus, User, Settings } from "lucide-react";
import { useTheme } from "next-themes";

const BottomNav = () => {
  const scrollDirection = useScrollingEffect(); // Use the custom hook
  const navClass = scrollDirection === "up" ? "" : "opacity-25 duration-500";

  const {
    isHomeActive,
    isDiscoverActive,
    isFeedActive,
    isNewActive,
    isProfileActive,
    isSettingsActive,
  } = useNavigation();

  const { theme } = useTheme();

  return (
    <div
      className={`fixed bottom-0 w-full py-4 z-10 bg-background border-t border-zinc-200 shadow-lg sm:hidden ${navClass}`}
    >
      <div className="flex flex-row justify-around items-center bg-transparent w-full">
        <Link href="/" className="flex items-center relative">
          {isHomeActive ? (
            <Home
              width="32"
              height="32"
              stroke={theme === "dark" ? "white" : "black"}
            />
          ) : (
            <Home width="32" height="32" stroke="gray" />
          )}
          {/* <span className="h-2 w-2 rounded-full bg-sky-500 absolute -top-0.5 right-[3px]"></span> */}
        </Link>
        <Link href="/discover" className="flex items-center">
          {isDiscoverActive ? (
            <DoorOpen
              width="32"
              height="32"
              stroke={theme === "dark" ? "white" : "black"}
            />
          ) : (
            <DoorOpen width="32" height="32" stroke="gray" />
          )}
        </Link>
        <Link href="/feed" className="flex items-center">
          {isFeedActive ? (
            <Newspaper
              width="32"
              height="32"
              stroke={theme === "dark" ? "white" : "black"}
            />
          ) : (
            <Newspaper width="32" height="32" stroke="gray" />
          )}
        </Link>
        <Link href="/feed/new" className="flex items-center">
          {isNewActive ? (
            <BadgePlus
              width="32"
              height="32"
              stroke={theme === "dark" ? "white" : "black"}
            />
          ) : (
            <BadgePlus width="32" height="32" stroke="gray" />
          )}
        </Link>
        <Link href="/profile" className="flex items-center">
          {isProfileActive ? (
            <User
              width="32"
              height="32"
              stroke={theme === "dark" ? "white" : "black"}
            />
          ) : (
            <User width="32" height="32" stroke="gray" />
          )}
        </Link>
        <Link href="/settings" className="flex items-center">
          {isSettingsActive ? (
            <Settings
              width="32"
              height="32"
              stroke={theme === "dark" ? "white" : "black"}
            />
          ) : (
            <Settings width="32" height="32" stroke="gray" />
          )}
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
