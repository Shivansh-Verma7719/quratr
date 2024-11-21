"use client";
import React, { useEffect, useState } from "react";
import {
  LogLevel,
  StatsigProvider,
  useClientAsyncInit,
} from "@statsig/react-bindings";
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
  const { client } = useClientAsyncInit(
    process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!,
    {
      userID: user.id,
      email: user.email
    },
    { logLevel: LogLevel.Debug } // Optional - Prints debug logs to the console
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    runStatsigAutoCapture(client);
  }, [client, user]);

  if (!mounted) return null;
  return <StatsigProvider client={client}>{children}</StatsigProvider>;
}
