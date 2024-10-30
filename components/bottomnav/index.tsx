"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Home,
  ListChecks,
  Newspaper,
  PlusCircle,
  // Settings,
  // LogIn,
  // NotebookPen
} from "lucide-react";
import { IconSwipe } from "@tabler/icons-react";
import { Link } from "@nextui-org/link";
import { usePathname } from "next/navigation";
// import { checkLoggedIn } from "./helpers";

interface Page {
  name: string;
  href: string;
  icon: React.ElementType;
  active: boolean;
}

function BottomNav() {
  const pathname = usePathname();
  const [pages, setPages] = useState<Page[]>([]);

  const checkRouteActive = (path: string) => {
    return pathname === path;
  };

  const isHomeActive = checkRouteActive("/");
  const isDiscoverActive = checkRouteActive("/discover");
  const isFeedActive = checkRouteActive("/feed");
  const isProfileActive = checkRouteActive("/profile");
  const isCuratedActive = checkRouteActive("/curated");
  const isLoginActive = checkRouteActive("/login");
  const isRegisterActive = checkRouteActive("/register");
  const isPostActive = checkRouteActive("/feed/new");

  useEffect(() => {
    const fetchPages = async () => {
      let pages: Page[] = [];

      // if (await checkLoggedIn()) {
        pages = [
          {
            name: "Home",
            href: "/",
            icon: Home,
            active: isHomeActive,
          },
          {
            name: "Discover",
            href: "/discover",
            icon: IconSwipe,
            active: isDiscoverActive,
          },
          {
            name: "Curated",
            href: "/curated",
            icon: ListChecks,
            active: isCuratedActive,
          },
          {
            name: "Feed",
            href: "/feed",
            icon: Newspaper,
            active: isFeedActive,
          },
          {
            name: "Post",
            href: "/feed/new",
            icon: PlusCircle,
            active: isPostActive,
          },
        ];
      // } else {
      //   pages = [
      //     { name: "Home", href: "/", icon: Home, active: isHomeActive },
        //   { name: "Login", href: "/login", icon: LogIn, active: isLoginActive },
        //   {
        //     name: "Register",
        //     href: "/register",
        //     icon: NotebookPen,
        //     active: isRegisterActive,
        //   },
        // ];
      // }

      setPages(pages);
    };
    fetchPages();
  }, [
    isHomeActive,
    isDiscoverActive,
    isFeedActive,
    isProfileActive,
    isCuratedActive,
    isLoginActive,
    isRegisterActive,
    isPostActive,
  ]);

  const { theme } = useTheme();

  return (
    <div className={`fixed bottom-0 w-full py-4 z-10 bg-background md:hidden`}>
      <div className="flex flex-row justify-around items-center bg-transparent w-full">
        {pages.map((page, index) => (
          <Link key={index} href={page.href} className="flex items-center">
            {page.active ? (
              page.name === "Discover" ? (
                <IconSwipe color={theme === "dark" ? "white" : "black"} size={34} />
              ) : (
                <page.icon
                  width="34"
                  height="34"
                  stroke={theme === "dark" ? "white" : "black"}
                />
              )
            ) : (
              page.name === "Discover" ? (
                <IconSwipe color="gray" size={34} />
              ) : (
                <page.icon width="34" height="34" stroke="gray" />
              )
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
