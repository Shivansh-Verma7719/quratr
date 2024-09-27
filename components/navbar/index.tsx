"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useTransform, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import QuratrLogo from "@/public/images/logo.png";
import { ThemeSwitcher } from "../theme-switcher";
import { useTheme } from "next-themes";
import QuratrLogoDark from "@/public/images/logo_dark.png";

const CustomNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);
  const { theme } = useTheme();
  useEffect(
    () => {
      console.log(theme)
    },
    [theme]
  );
  const themeLogo = theme === "light" ? QuratrLogoDark : QuratrLogo;

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
              <h1 className="text-2xl p-0 ml-0 font-bold"
                style={{marginLeft: "0px"}}>uratr</h1>
            </motion.div>
          </a>
          <div className="hidden md:flex space-x-1">
            {["#Features", "#About", "/Feedback"].map((item) => (
              <motion.a
                key={item}
                href={`${item.toLowerCase()}`}
                className="text-text px-3 py-2 rounded-md text-sm font-medium transition-colors relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.slice(1)}
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-white origin-left transform scale-x-0 transition-transform group-hover:scale-x-100"
                  initial={false}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
            <ThemeSwitcher />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#fed4e4] text-black px-4 py-2 rounded-full transition-colors text-sm font-medium"
              onClick={() => {
                document
                  .getElementById("waitlist")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <p>Join the Waitlist</p>
            </motion.button>
          </div>
          <div className="md:hidden">
            <ThemeSwitcher className="fixed top-2 right-12"/>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
            {/* <ThemeSwitcher /> */}
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
            {["#Features", "#About", "/Feedback"].map((item) => (
              <a
                key={item}
                href={`${item.toLowerCase()}`}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <button className="bg-black text-white px-4 py-2 rounded-full transition-colors text-sm font-medium mt-2">
              Get Started
            </button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default CustomNavbar;
