"use client";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Button,
} from "@heroui/react";
import { Settings } from "lucide-react";
import QuratrLogoDark from "@/components/logos/logo_light";
import QuratrLogo from "@/components/logos/logo";
import { User } from "@supabase/supabase-js";
import { UserProfile } from "@/app/layoutWrapper";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Topbar = ({
  user,
  userProfile,
}: {
  user: User | null;
  userProfile: UserProfile | null;
}) => {
  const router = useRouter();

  const handleAction = (key: string) => {
    if (key === "profile_link") {
      router.push("/profile");
    } else if (key === "logout") {
      router.push("/logout");
    }
  };

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
          <Dropdown placement="bottom-end" backdrop="blur">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                showFallback
                name={userProfile?.first_name + " " + userProfile?.last_name}
                getInitials={(name) =>
                  name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                }
                size="sm"
              />
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Profile Actions"
              variant="flat"
              onAction={(key) => handleAction(key as string)}
            >
              <DropdownItem
                key="profile"
                className="h-14 gap-2 border-b border-divider"
                textValue="Signed in as"
              >
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user?.email}</p>
              </DropdownItem>
              <DropdownItem
                key="profile_link"
                className="text-primary"
              >
                Profile
              </DropdownItem>
              <DropdownItem
                key="logout"
                className="text-danger"
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
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
          <Button as={Link} href="/profile/edit" isIconOnly variant="light" aria-label="Settings">
            <Settings size={30} stroke="gray" />
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Topbar;
