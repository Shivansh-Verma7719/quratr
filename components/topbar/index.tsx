"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import QuratrLogoDark from "@/components/logos/logo_light";
import QuratrLogo from "@/components/logos/logo";
import { User } from "@supabase/supabase-js";
import { UserProfile } from "@/app/layoutWrapper";
import Link from "next/link";
import { useTheme } from "next-themes";
import Search from "@/components/Search";
import { Avatar } from "@heroui/react";

const Topbar = ({
  user,
  userProfile,
}: {
  user: User | null;
  userProfile: UserProfile | null;
}) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const ThemeLogo = theme === "light" ? QuratrLogoDark : QuratrLogo;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-divider bg-background bg-opacity-90 backdrop-blur-sm md:block">
      <div className="flex h-14 items-center px-4">
        {/* Left: Logo (fixed width) */}
        <div className="flex-shrink-0">
          <Link href="/feed" className="flex items-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-row items-center bg-clip-text text-2xl font-bold text-text"
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
        </div>

        {/* Middle: Search (flexible width) */}
        {user && (
          <div className="flex flex-1 justify-end mx-3 md:mx-4">
            <Search />
          </div>
        )}

        {/* Right: Avatar (fixed width) */}
        {user && (
          <div className="flex-shrink-0">
            <Avatar
              isBordered
              as={Link}
              href="/profile"
              className="transition-transform hover:scale-105"
              color="primary"
              src={userProfile?.avatar}
              alt={userProfile?.first_name + " " + userProfile?.last_name}
              showFallback
              name={userProfile?.first_name + " " + userProfile?.last_name}
              imgProps={{
                referrerPolicy: "no-referrer",
              }}
              getInitials={(name) =>
                name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
              }
              size="sm"
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;