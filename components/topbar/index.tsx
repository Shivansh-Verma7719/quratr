"use client";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { Settings } from "lucide-react";
import QuratrLogoDark from "@/components/logos/logo_light";
import QuratrLogo from "@/components/logos/logo";
import { getUser, User } from "./helpers";
import { useState, useEffect } from "react";

const Topbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getUser().then((user) => {
      setUser(user);
      if (user?.username !== undefined) {
        setIsLoggedIn(true);
      }
    });
  }, []);

  return (
    <Navbar
      className="bg-background md:hidden backdrop-blur-md border-b border-divider"
      maxWidth="full"
      height="3rem"
      shouldHideOnScroll
    >
      <NavbarContent justify="start" className={isLoggedIn ? "" : "hidden"}>
        <NavbarItem key="profile_dropdown">
          {/* <Link href="/profile">
            <Button isIconOnly variant="light" aria-label="Profile">
              <UserCircle size={30} stroke="gray" />
            </Button>
          </Link> */}
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                showFallback
                name={user?.first_name + " " + user?.last_name}
                getInitials={(name) =>
                  name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                }
                size="sm"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem
                key="profile"
                className="h-14 gap-2 border-b border-divider"
                textValue="Signed in as"
              >
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user?.email}</p>
              </DropdownItem>
              <DropdownItem key="profile_link" textValue="Profile">
                <Link href="/profile">Profile</Link>
              </DropdownItem>
              {/* <DropdownItem key="team_settings">Team Settings</DropdownItem> */}
              {/* <DropdownItem key="analytics">Analytics</DropdownItem> */}
              {/* <DropdownItem key="system">System</DropdownItem> */}
              {/* <DropdownItem key="configurations">Configurations</DropdownItem> */}
              <DropdownItem key="feedback" textValue="Feedback">
                <Link href="/feedback">Feedback</Link>
              </DropdownItem>
              <DropdownItem key="logout" textValue="Log Out">
                <Link href="/logout" color="danger">
                  Log Out
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className={isLoggedIn ? "" : "mx-auto"} justify="center">
        <NavbarItem>
          <Link
            href="/"
            className="relative flex items-center justify-center w-10 h-10"
          >
            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-0 dark:opacity-0">
              <QuratrLogoDark
                width={40}
                height={40}
                className="w-full h-full"
              />
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
