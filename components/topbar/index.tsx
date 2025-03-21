"use client";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Avatar,
  Button,
} from "@heroui/react";
import { LogOut } from "lucide-react";
import QuratrLogoDark from "@/components/logos/logo_light";
import QuratrLogo from "@/components/logos/logo";
import { User } from "@supabase/supabase-js";
import { UserProfile } from "@/app/layoutWrapper";
import Link from "next/link";

const Topbar = ({
  user,
  userProfile,
}: {
  user: User | null;
  userProfile: UserProfile | null;
}) => {
  return (
    <Navbar
      className="border-b border-divider bg-background md:hidden"
      maxWidth="full"
      height="3rem"
      shouldHideOnScroll
      id="topbar"
    >
      <NavbarContent justify="start" className={user ? "" : "hidden"}>
        <NavbarItem key="profile_dropdown">
          <Avatar
            isBordered
            as={Link}
            href="/profile"
            className="transition-transform"
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
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className={user ? "" : "mx-auto"} justify="center">
        <NavbarItem>
          <Link
            href="/feed"
            className="relative flex h-10 w-10 items-center justify-center"
          >
            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-0 dark:opacity-0">
              <QuratrLogoDark
                width={40}
                height={40}
                className="h-full w-full"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-0 dark:opacity-100">
              <QuratrLogo width={40} height={40} className="h-full w-full" />
            </div>
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end" className={user ? "" : "hidden"}>
        <NavbarItem>
          <Button as={Link} href="/logout" isIconOnly variant="light" aria-label="Settings">
            <LogOut size={30} stroke="gray" />
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Topbar;
