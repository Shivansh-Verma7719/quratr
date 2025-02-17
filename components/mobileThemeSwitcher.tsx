"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function MobileThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show when scrolling up or at top of page
      if (currentScrollY < lastScrollY || currentScrollY < 370) {
        setIsVisible(true);
      } 
      // Hide when scrolling down
      else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : 200 }}
      transition={{ duration: 0.3 }}
      className="md:hidden fixed bottom-14 right-3 z-40"
    >
      <motion.button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        animate={{
          backgroundColor: theme === "dark" ? "#ffffff" : "#000000",
          color: theme === "dark" ? "#000000" : "#ffffff",
        }}
        transition={{ duration: 0.5 }}
        className="p-3 rounded-full shadow-lg relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {theme === "dark" ? (
            <motion.div
              key="sun"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 30, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Sun className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 30, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Moon className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}
