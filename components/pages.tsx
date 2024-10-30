"use client";
import {
  Home,
  DoorOpen,
  Newspaper,
  BadgePlus,
  LogOut,
  User,
  ListChecks,
  MessageCircleReply,
  Settings,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const isLoggedIn = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

const getPages = async () => {
  let pages = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/#about", icon: DoorOpen },
    { name: "Feedback", href: "/feedback", icon: MessageCircleReply },
    // { name: "Discover", href: "/discover", icon: BadgePlus },
    // { name: "Feed", href: "/feed", icon: Newspaper },
    { name: "Login", href: "/login", icon: User },
    { name: "Register", href: "/register", icon: Settings },
  ];

  if (await isLoggedIn()) {
    pages = [
      { name: "Home", href: "/", icon: Home },
      { name: "Discover", href: "/discover", icon: BadgePlus },
      { name: "Feed", href: "/feed", icon: Newspaper },
      { name: "Profile", href: "/profile", icon: User },
      { name: "Curated", href: "/curated", icon: ListChecks },
      { name: "Feedback", href: "/feedback", icon: MessageCircleReply },
      { name: "Logout", href: "/logout", icon: LogOut },
    ];
  }
  return pages;
};

export { getPages };
