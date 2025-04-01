"use client";
import { useState, useEffect } from "react";
import { motion, useTransform, useScroll } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Home,
  DoorOpen,
  Newspaper,
  BadgePlus,
  LogOut,
  User as UserIcon,
  ListChecks,
  Settings,
  Menu,
  Sparkles,
  X
} from "lucide-react";
import Logo from "../logos/logo";
import Link from "next/link";
import Logo_Light from "../logos/logo_light";
import { User } from "@supabase/supabase-js";

const CustomNavbar: React.FC<{ user: User | null }> = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);
  const { theme } = useTheme();
  const ThemeLogo = theme === "light" ? Logo_Light : Logo;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  let pages = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/#about", icon: DoorOpen },
    { name: "Login", href: "/login", icon: UserIcon },
    { name: "Register", href: "/register", icon: Settings },
  ];

  if (user) {
    pages = [
      { name: "Home", href: "/", icon: Home },
      { name: "AI", href: "/ai", icon: Sparkles },
      { name: "Discover", href: "/discover", icon: BadgePlus },
      { name: "Feed", href: "/feed", icon: Newspaper },
      { name: "Profile", href: "/profile", icon: UserIcon },
      { name: "Curated", href: "/curated", icon: ListChecks },
      { name: "Logout", href: "/logout", icon: LogOut },
    ];
  }

  if (!mounted) return null;

  return (
    <motion.header
      style={{ opacity: headerOpacity }}
      className="fixed left-0 right-0 top-0 z-50 hidden border-b border-gray-700 bg-background bg-opacity-90 text-text shadow-sm backdrop-blur-sm md:block"
    >
      <nav className="container mx-auto px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-row bg-clip-text text-2xl font-bold text-text"
            >
              <ThemeLogo width={35} height={35} />
              <h1
                className="ml-0 translate-y-[0.3rem] p-0 text-2xl font-bold"
                style={{ marginLeft: "0px" }}
              >
                uratr
              </h1>
            </motion.div>
          </Link>
          <div className="hidden space-x-1 md:flex">
            {pages.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="group relative rounded-md px-3 py-2 text-sm font-medium text-text transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
                <motion.span
                  className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 transform bg-white transition-transform group-hover:scale-x-100"
                  initial={false}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
            {/* <ThemeSwitcher /> */}
          </div>
          <div className="md:hidden">
            {/* <ThemeSwitcher className="fixed right-12" /> */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </nav>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="border-t border-gray-100 bg-white py-4 md:hidden"
        >
          <div className="container mx-auto flex flex-col space-y-2 px-4">
            {pages.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default CustomNavbar;
