"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, useTransform, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import QuratrLogo from "@/public/images/logo.png";
import { ThemeSwitcher } from "../theme-switcher";
import { useTheme } from "next-themes";
import QuratrLogoDark from "@/public/images/logo_dark.png";
import { isSignedIn } from "@/utils/supabase/issignedin";

const CustomNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);
  const { theme } = useTheme();
  const themeLogo = theme === "light" ? QuratrLogoDark : QuratrLogo;
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const checkSignInStatus = async () => {
      const signedInStatus = await isSignedIn();
      setSignedIn(signedInStatus);
    };
    checkSignInStatus();
  }, [signedIn]);

  
  const pages = [
    { name: "Features", href: "/#features" },
    { name: "About", href: "/#about" },
    { name: "Feedback", href: "/feedback" },
    { name: "Discover", href: "/discover" },
    { name: "Feed", href: "/feed" },
    { name: "Login", href: "/login" },
    { name: "Register", href: "/register" },
  ];

  if (signedIn) {
    // Remove Login and Register pages
    pages.splice(pages.findIndex(page => page.name === "Login"), 1);
    pages.splice(pages.findIndex(page => page.name === "Register"), 1);
    
    // Add Signout page
    pages.push({ name: "Signout", href: "/logout" });
  }
  
  return (
    <motion.header
      style={{ opacity: headerOpacity }}
      className="fixed top-0 left-0 right-0 z-50 bg-background text-text bg-opacity-90 backdrop-blur-sm shadow-sm"
    >
      <nav className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          <a href="/">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl flex text-text flex-row font-bold bg-clip-text"
            >
              <Image
                src={themeLogo}
                alt="Quratr logo"
                width={35}
                height={35}
                className="-translate-y-[0.2rem] translate-x-[0.2rem]"
              />
              <h1
                className="text-2xl p-0 ml-0 font-bold"
                style={{ marginLeft: "0px" }}
              >
                uratr
              </h1>
            </motion.div>
          </a>
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
            <a href="/waitlist">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#fed4e4] text-black px-4 py-2 rounded-full transition-colors text-sm font-medium"
              >
                <p>Join the Waitlist</p>
              </motion.button>
            </a>
          </div>
          <div className="md:hidden">
            <ThemeSwitcher className="fixed top-4 right-12" />
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
              <a
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <a href="/waitlist">
              <button className="bg-[#fed4e4] text-black px-4 py-2 rounded-full transition-colors text-sm font-medium mt-2">
                Join the Waitlist
              </button>
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default CustomNavbar;
