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

const Topbar = () => {
  const { theme } = useTheme();
  const themeLogo = theme === "light" ? QuratrLogoDark : QuratrLogo;

  return (
    <Navbar
      className="bg-background md:hidden backdrop-blur-md border-b border-divider"
      maxWidth="full"
      height="4rem"
      shouldHideOnScroll
    >
      <NavbarContent className="flex justify-center items-center w-full">
        <NavbarItem className="w-1/3 flex justify-start items-center">
          <Link href="/profile">
            <Button isIconOnly variant="light" aria-label="Profile">
              <UserCircle size={35} />
            </Button>
          </Link>
        </NavbarItem>

        <NavbarItem className="w-1/3 flex justify-center items-center">
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

        <NavbarItem className="w-1/3 flex justify-end items-start">
          <Link href="/profile/edit">
            <Button isIconOnly variant="light" aria-label="Settings">
              <Settings size={35} />
            </Button>
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Topbar;
