"use client";
import React, { useEffect } from "react";
import { logout } from "./actions";
import { useRouter } from "next/navigation";

const LogoutPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      const res = await logout();
      if (res === "Logged out") {
        router.push("/");
      }
    };

    handleLogout();
  }, [router]);

  return null;
};

export default LogoutPage;
