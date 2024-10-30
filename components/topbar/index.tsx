"use client";
// import { useState, useEffect } from "react";
import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { Settings, UserCircle } from "lucide-react";
import { useTheme } from "next-themes";
import QuratrLogoDark from "@/public/images/logo_dark.png";
import QuratrLogo from "@/public/images/logo_small.png";
import Link from "next/link";
import { checkLoggedIn } from "./helpers";
import { useState } from "react";
import { useEffect } from "react";

const Topbar = () => {
  const { theme } = useTheme();
  const themeLogo = theme === "light" ? QuratrLogoDark : QuratrLogo;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoggedIn().then((loggedIn) => setIsLoggedIn(loggedIn));
    setIsLoggedIn(false);
  }, []);

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
            <Image
              src={themeLogo}
              alt="Quratr logo"
              width={50}
              height={50}
              className="translate-y-[-0.1rem]"
            />
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
