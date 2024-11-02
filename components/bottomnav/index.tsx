"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Home,
  ListCheck,
  LogIn,
  Newspaper,
  NotebookPen,
  PlusCircle,
} from "lucide-react";
import { IconSwipe } from "@tabler/icons-react";
import { Link } from "@nextui-org/link";
import { usePathname } from "next/navigation";
import { checkLoggedIn } from "./helpers";
import { motion, AnimatePresence } from "framer-motion";

interface Page {
  name: string;
  href: string;
  icon: React.ElementType;
}

const BottomNav = () => {
  const pathname = usePathname();
  const [pages, setPages] = useState<Page[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchLoggedIn = async () => {
      checkLoggedIn()
        .then((loggedIn) => {
          // console.log(loggedIn);
          setIsLoggedIn(loggedIn);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    setIsLoading(true);
    fetchLoggedIn();
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY || currentScrollY < 370) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const initializeNav = async () => {
      const newPages = isLoggedIn
        ? [
            { name: "Home", href: "/", icon: Home },
            { name: "Discover", href: "/discover", icon: IconSwipe },
            { name: "Curated", href: "/curated", icon: ListCheck },
            { name: "Feed", href: "/feed", icon: Newspaper },
            { name: "Post", href: "/feed/new", icon: PlusCircle },
          ]
        : [
            { name: "Home", href: "/", icon: Home },
            { name: "Login", href: "/login", icon: LogIn },
            { name: "Register", href: "/register", icon: NotebookPen },
          ];

      setPages(newPages);
    };

    initializeNav();
  }, [isLoggedIn]);

  if (isLoading) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.5,
          }}
          className="fixed bottom-0 w-full py-2 z-40 bg-background md:hidden border-t border-gray-700"
        >
          <div className="flex flex-row justify-around items-center bg-transparent w-full">
            {pages.map((page, index) => (
              <Link
                key={index}
                href={page.href}
                className="flex items-center z-50"
              >
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
      )}
    </AnimatePresence>
  );
};

export default BottomNav;
