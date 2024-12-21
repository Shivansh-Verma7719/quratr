"use client";
import React, { useEffect, useState } from "react";
import { StatsigProvider, useClientAsyncInit } from "@statsig/react-bindings";
import { runStatsigAutoCapture } from "@statsig/web-analytics";
import { User } from "@supabase/supabase-js";

export default function MyStatsig({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const [mounted, setMounted] = useState(false);
  const [isDev, setIsDev] = useState(false);

  const { client } = useClientAsyncInit(
    process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!,
    {
      userID: user.id,
      email: user.email,
    }
  );

  // Set mounted state to true after the initial render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check the environment only after the component is mounted
  useEffect(() => {
    if (mounted) {
      setIsDev(process.env.NEXT_PUBLIC_DEV === "true");
    }
  }, [mounted]);

  useEffect(() => {
    if (mounted && !isDev && client) {
      runStatsigAutoCapture(client);
    }
  }, [mounted, isDev, client, user]);

  // Return children directly if in dev mode or not mounted
  if (!mounted || isDev) {
    return <>{children}</>;
  }

  return <StatsigProvider client={client}>{children}</StatsigProvider>;
}
