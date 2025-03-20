"use client";
import React, { useEffect, useState } from "react";
// import { useTheme } from "next-themes";
import {
  Home,
  ListCheck,
  LogIn,
  NotebookPen,
  PlusCircle,
  Users,
} from "lucide-react";
import { IconSwipe } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "@supabase/supabase-js";

const BottomNav = ({ user }: { user: User | null }) => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  // const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const pages = user
    ? [
        { name: "Home", href: "/feed", icon: Home },
        { name: "Discover", href: "/discover", icon: IconSwipe },
        { name: "Curated", href: "/curated", icon: ListCheck },
        { name: "Group Experience", href: "/group_swipe", icon: Users },
        { name: "Post", href: "/feed/new", icon: PlusCircle },
      ]
    : [
        { name: "Home", href: "/", icon: Home },
        { name: "Login", href: "/login", icon: LogIn },
        { name: "Register", href: "/register", icon: NotebookPen },
      ];

  // Get the icon color based on active status and theme
  const getIconColor = (isActive: boolean) => {
    if (!mounted) return "gray";
    
    if (isActive) {
      // Use text color for active icons (will adapt to theme automatically)
      return "var(--color-foreground)";
    } else {
      // Use a muted color for inactive icons
      return "gray";
    }
  };

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          id="bottom-nav"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.3,
          }}
          className="fixed bottom-0 z-40 w-full border-t border-gray-700 bg-background py-2 md:hidden"
        >
          <div className="flex w-full flex-row items-center justify-around bg-transparent">
            {pages.map((page, index) => (
              <Link
                key={index}
                href={page.href}
                className="z-50 flex items-center"
              >
                {page.name === "Discover" ? (
                  <IconSwipe
                    color={getIconColor(pathname === page.href)}
                    size={30}
                  />
                ) : (
                  <page.icon
                    width="30"
                    height="30"
                    stroke={getIconColor(pathname === page.href)}
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