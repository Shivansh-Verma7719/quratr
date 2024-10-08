"use client";
import useNavigation from "@/hooks/useNavigation";

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
    { name: "Discover", href: "/app/experience/discover", icon: BadgePlus },
    { name: "Feed", href: "/app/feed", icon: Newspaper },
    { name: "Login", href: "/login", icon: User },
    { name: "Register", href: "/register", icon: Settings },
  ];

  if (await isLoggedIn()) {
    pages = [
      { name: "Home", href: "/", icon: Home },
      { name: "Discover", href: "/app/experience/discover", icon: BadgePlus },
      { name: "Feed", href: "/app/feed", icon: Newspaper },
      { name: "Profile", href: "/app/profile", icon: User },
      { name: "Curated", href: "/app/experience/curated", icon: ListChecks },
      { name: "Feedback", href: "/feedback", icon: MessageCircleReply },
      { name: "Logout", href: "/logout", icon: LogOut },
    ];
  }
  return pages;
};

const BottomPages = () => {
  const {
    isHomeActive,
    isDiscoverActive,
    isFeedActive,
    // isNewActive,
    isProfileActive,
    isCuratedActive,
    // isFeedbackActive,
    // isLogoutActive,
  } = useNavigation();

  const pages = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      active: isHomeActive,
    },
    {
      name: "Discover",
      href: "/app/experience/discover",
      icon: BadgePlus,
      active: isDiscoverActive,
    },
    {
      name: 'Curated',
      href: '/app/experience/curated',
      icon: ListChecks,
      active: isCuratedActive,
    },
    {
      name: "Feed",
      href: "/app/feed",
      icon: Newspaper,
      active: isFeedActive,
    },
    {
      name: "Profile",
      href: "/app/profile",
      icon: User,
      active: isProfileActive,
    },
  ];
  return pages;
};

export { getPages, BottomPages };