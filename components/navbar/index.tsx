"use client";
import { useState, useEffect } from "react";
import { motion, useTransform, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeSwitcher } from "../theme-switcher";
import { useTheme } from "next-themes";
import {
  Home,
  DoorOpen,
  Newspaper,
  BadgePlus,
  LogOut,
  User as UserIcon,
  ListChecks,
  MessageCircleReply,
  Settings,
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
    { name: "Feedback", href: "/feedback", icon: MessageCircleReply },
    // { name: "Discover", href: "/discover", icon: BadgePlus },
    // { name: "Feed", href: "/feed", icon: Newspaper },
    { name: "Login", href: "/login", icon: UserIcon },
    { name: "Register", href: "/register", icon: Settings },
  ];

  if (user) {
    pages = [
      { name: "Home", href: "/", icon: Home },
      { name: "Discover", href: "/discover", icon: BadgePlus },
      { name: "Feed", href: "/feed", icon: Newspaper },
      { name: "Profile", href: "/profile", icon: UserIcon },
      { name: "Curated", href: "/curated", icon: ListChecks },
      { name: "Feedback", href: "/feedback", icon: MessageCircleReply },
      { name: "Logout", href: "/logout", icon: LogOut },
    ];
  }

  if (!mounted) return null;

  return (
    <motion.header
      style={{ opacity: headerOpacity }}
      className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-background text-text bg-opacity-90 backdrop-blur-sm shadow-sm border-b border-gray-700"
    >
      <nav className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl flex text-text flex-row font-bold bg-clip-text"
            >
              <ThemeLogo width={35} height={35} />
              <h1
                className="text-2xl p-0 ml-0 font-bold translate-y-[0.3rem]"
                style={{ marginLeft: "0px" }}
              >
                uratr
              </h1>
            </motion.div>
          </Link>
          <div className="hidden md:flex space-x-1">
            {pages.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-text px-3 py-2 rounded-md text-sm font-medium transition-colors relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-white origin-left transform scale-x-0 transition-transform group-hover:scale-x-100"
                  initial={false}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
            <ThemeSwitcher />
          </div>
          <div className="md:hidden">
            <ThemeSwitcher className="fixed right-12" />
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
          className="md:hidden bg-white py-4 border-t border-gray-100"
        >
          <div className="container mx-auto px-4 flex flex-col space-y-2">
            {pages.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
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
