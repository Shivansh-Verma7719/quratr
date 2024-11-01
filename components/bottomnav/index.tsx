"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Home,
  ListChecks,
  LogIn,
  Newspaper,
  NotebookPen,
  PlusCircle,
} from "lucide-react";
import { IconSwipe } from "@tabler/icons-react";
import { Link } from "@nextui-org/link";
import { usePathname } from "next/navigation";
import { checkLoggedIn } from "./helpers";
import { motion } from "framer-motion";

interface Page {
  name: string;
  href: string;
  icon: React.ElementType;
}

function BottomNav() {
  const pathname = usePathname();
  const [pages, setPages] = useState<Page[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show nav when scrolling up or at top of page
      if (currentScrollY < lastScrollY || currentScrollY < 370) {
        setIsVisible(true);
      }
      // Hide nav when scrolling down
      else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const fetchPages = async () => {
      let pages: Page[] = [];

      if (await checkLoggedIn()) {
        pages = [
          {
            name: "Home",
            href: "/",
            icon: Home,
          },
          {
            name: "Discover",
            href: "/discover",
            icon: IconSwipe,
          },
          {
            name: "Curated",
            href: "/curated",
            icon: ListChecks,
          },
          {
            name: "Feed",
            href: "/feed",
            icon: Newspaper,
          },
          {
            name: "Post",
            href: "/feed/new",
            icon: PlusCircle,
          },
        ];
      } else {
        pages = [
          { name: "Home", href: "/", icon: Home },
          { name: "Login", href: "/login", icon: LogIn },
          {
            name: "Register",
            href: "/register",
            icon: NotebookPen,
          },
        ];
      }

      setPages(pages);
    };
    fetchPages();
  }, []);

  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ duration: 0.3 }}
      className={`fixed bottom-0 w-full py-2 z-40 bg-background md:hidden border-t border-gray-700`}
    >
      <div className="flex flex-row justify-around items-center bg-transparent w-full">
        {pages.map((page, index) => (
          <Link key={index} href={page.href} className="flex items-center z-50">
            {page.name === "Discover" ? (
              <IconSwipe
                color={
                  pathname === page.href
                    ? theme === "dark"
                      ? "white"
                      : "black"
                    : "gray"
                }
                size={30}
              />
            ) : (
              <page.icon
                width="30"
                height="30"
                stroke={
                  pathname === page.href
                    ? theme === "dark"
                      ? "white"
                      : "black"
                    : "gray"
                }
              />
            )}
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

export default BottomNav;
