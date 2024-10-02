"use client";
import { isSignedIn } from "@/utils/supabase/issignedin";
import useNavigation from "@/hook/use-navigation";

import {
  Home,
  DoorOpen,
  Newspaper,
  BadgePlus,
  LogOut,
  User,
  MessageCircleReply,
  Settings,
} from "lucide-react";

const getPages = async () => {
  let pages = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/#about", icon: DoorOpen },
    { name: "Feedback", href: "/feedback", icon: MessageCircleReply },
    { name: "Discover", href: "/discover", icon: BadgePlus },
    { name: "Feed", href: "/feed", icon: Newspaper },
    { name: "Login", href: "/login", icon: User },
    { name: "Register", href: "/register", icon: Settings },
  ];

  if (await isSignedIn()) {
    pages = [
      { name: "Home", href: "/", icon: Home },
      { name: "Discover", href: "/discover", icon: BadgePlus },
      { name: "Feed", href: "/feed", icon: Newspaper },
      { name: "Profile", href: "/profile", icon: User },
      { name: "Settings", href: "/settings", icon: Settings },
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
    isNewActive,
    isProfileActive,
    isSettingsActive,
    isFeedbackActive,
    isLogoutActive,
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
      href: "/discover",
      icon: BadgePlus,
      active: isDiscoverActive,
    },
    {
      name: "Feed",
      href: "/feed",
      icon: Newspaper,
      active: isFeedActive,
    },
    {
      name: "New",
      href: "/feed/new",
      icon: BadgePlus,
      active: isNewActive,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      active: isProfileActive,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      active: isSettingsActive,
    },
    {
      name: "Feedback",
      href: "/feedback",
      icon: MessageCircleReply,
      active: isFeedbackActive,
    },
    {
      name: "Logout",
      href: "/logout",
      icon: LogOut,
      active: isLogoutActive,
    },
  ];
  return pages;
};

export { getPages, BottomPages };
