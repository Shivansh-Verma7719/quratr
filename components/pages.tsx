"use client";
import {
  Home,
  DoorOpen,
  Newspaper,
  BadgePlus,
  LogOut,
  User,
  ListChecks,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from 'react';
import { Session } from "@supabase/supabase-js";

// Custom hook to get session
export const useSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
      }

      setSession(data.session);
      setLoading(false);
    };

    fetchSession();
  }, []);

  return { session, loading };
};

// Hook to get navigation pages based on auth state
export const usePages = () => {
  const { session, loading } = useSession();
  const [pages, setPages] = useState<{ name: string; href: string; icon: React.ComponentType }[]>([]);

  useEffect(() => {
    if (loading) return;

    if (session) {
      setPages([
        { name: "Home", href: "/", icon: Home },
        { name: "Discover", href: "/discover", icon: BadgePlus },
        { name: "Feed", href: "/feed", icon: Newspaper },
        { name: "Profile", href: "/profile", icon: User },
        { name: "Curated", href: "/curated", icon: ListChecks },
        { name: "AI", href: "/ai", icon: Sparkles },
        { name: "Group Experience", href: "/group_swipe", icon: Users },
        { name: "Logout", href: "/logout", icon: LogOut },
      ]);
    } else {
      setPages([
        { name: "Home", href: "/", icon: Home },
        { name: "About", href: "/#about", icon: DoorOpen },
        { name: "Login", href: "/login", icon: User },
        { name: "Register", href: "/register", icon: Settings },
      ]);
    }
  }, [session, loading]);

  return { pages, loading };
};

// For backward compatibility
const getPages = async () => {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();

  if (data.session) {
    return [
      { name: "Home", href: "/", icon: Home },
      { name: "Discover", href: "/discover", icon: BadgePlus },
      { name: "Feed", href: "/feed", icon: Newspaper },
      { name: "Profile", href: "/profile", icon: User },
      { name: "Curated", href: "/curated", icon: ListChecks },
      { name: "Logout", href: "/logout", icon: LogOut },
    ];
  }

  return [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/#about", icon: DoorOpen },
    { name: "Login", href: "/login", icon: User },
    { name: "Register", href: "/register", icon: Settings },
  ];
};

export { getPages };
