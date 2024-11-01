"use client";
import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Settings, UserCircle } from "lucide-react";
import QuratrLogoDark from "@/components/logos/logo_light";
import QuratrLogo from "@/components/logos/logo";
import Link from "next/link";
import { checkLoggedIn } from "./helpers";
import { useState, useEffect } from "react";

const Topbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  useEffect(() => {
    checkLoggedIn().then((loggedIn) => setIsLoggedIn(loggedIn));
    setIsLoggedIn(false);
  }, []);

  // if (!mounted) return null;

  return (
    <Navbar
      className="bg-background md:hidden backdrop-blur-md border-b border-divider"
      maxWidth="full"
      height="3rem"
      shouldHideOnScroll
    >
      <NavbarContent justify="start" className={isLoggedIn ? "" : "hidden"}>
        <NavbarItem>
          <Link href="/profile">
            <Button isIconOnly variant="light" aria-label="Profile">
              <UserCircle size={30} stroke="gray" />
            </Button>
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent
        className={isLoggedIn ? "" : "mx-auto"}
        justify="center"
      >
        <NavbarItem>
          <Link 
            href="/" 
            className="relative flex items-center justify-center w-10 h-10"
          >
            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-0 dark:opacity-0">
              <QuratrLogoDark width={40} height={40} className="w-full h-full" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-0 opacity-0 dark:opacity-100">
              <QuratrLogo width={40} height={40} className="w-full h-full" />
            </div>
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end" className={isLoggedIn ? "" : "hidden"}>
        <NavbarItem>
          <Link href="/profile/edit">
            <Button isIconOnly variant="light" aria-label="Settings">
              <Settings size={30} stroke="gray" />
            </Button>
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Topbar;
