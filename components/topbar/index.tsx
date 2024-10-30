"use client";
// import { useState, useEffect } from "react";
import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Settings, UserCircle } from "lucide-react";
import { useTheme } from "next-themes";
import QuratrLogoDark from "@/components/logos/logo_light";
import QuratrLogo from "@/components/logos/logo";
import Link from "next/link";
import { checkLoggedIn } from "./helpers";
import { useState } from "react";
import { useEffect } from "react";

const Topbar = () => {
  const { theme } = useTheme();
  const ThemeLogo = theme === "dark" ? QuratrLogo : QuratrLogoDark;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    checkLoggedIn().then((loggedIn) => setIsLoggedIn(loggedIn));
    setIsLoggedIn(false);
  }, []);

  if (!mounted) return null;

  return (
    <Navbar
      className="bg-background md:hidden backdrop-blur-md border-b border-divider"
      maxWidth="full"
      height="4rem"
      shouldHideOnScroll
    >
      <NavbarContent justify="start" className={isLoggedIn ? "" : "hidden"}>
        <NavbarItem>
          <Link href="/profile">
            <Button isIconOnly variant="light" aria-label="Profile">
              <UserCircle size={35} stroke="gray" />
            </Button>
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent
        className={isLoggedIn ? "" : "mx-auto"}
        justify="center"
      >
        <NavbarItem>
          <Link href="/">
            <ThemeLogo width={50} height={50} />
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end" className={isLoggedIn ? "" : "hidden"}>
        <NavbarItem>
          <Link href="/profile/edit">
            <Button isIconOnly variant="light" aria-label="Settings">
              <Settings size={35} stroke="gray" />
            </Button>
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Topbar;
