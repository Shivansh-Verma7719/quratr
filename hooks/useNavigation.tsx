"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const useNavigation = () => {
  const pathname = usePathname();
  const [isHomeActive, setIsHomeActive] = useState(false);
  const [isDiscoverActive, setIsDiscoverActive] = useState(false);
  const [isProfileActive, setIsProfileActive] = useState(false);
  const [isFeedActive, setIsFeedActive] = useState(false);
  const [isNewActive, setIsNewActive] = useState(false);
  const [isFeedbackActive, setIsFeedbackActive] = useState(false);
  const [isLogoutActive, setIsLogoutActive] = useState(false);
  const [isCuratedActive, setIsCuratedActive] = useState(false);
  const [isLoginActive, setIsLoginActive] = useState(false);
  const [isRegisterActive, setIsRegisterActive] = useState(false);
  useEffect(() => {
    setIsHomeActive(false);
    setIsDiscoverActive(false);
    setIsFeedActive(false);
    setIsProfileActive(false);
    setIsNewActive(false);
    setIsFeedbackActive(false);
    setIsLogoutActive(false);
    setIsCuratedActive(false);
    setIsLoginActive(false);
    setIsRegisterActive(false);
    switch (pathname) {
      case "/":
        setIsHomeActive(true);
        break;
      case '/app/experience/discover':
        setIsDiscoverActive(true);
        break;
      case '/app/feed':
        setIsFeedActive(true);
        break;
      case '/app/feed/new':
        setIsNewActive(true);
        break;
      case '/app/profile':
        setIsProfileActive(true);
        break;
      case '/app/experience/curated':
        setIsCuratedActive(true);
        break;
      case '/feedback':
        setIsFeedbackActive(true);
        break;
      case '/logout':
        setIsLogoutActive(true);
        break;
      case "/login":
        setIsLoginActive(true);
        break;
      case "/register":
        setIsRegisterActive(true);
        break;
      default:
        // Handle any other cases here
        break;
    }
  }, [pathname]);

  return {
    isHomeActive,
    isDiscoverActive,
    isFeedActive,
    isNewActive,
    isProfileActive,
    isCuratedActive,
    isFeedbackActive,
    isLogoutActive,
    isLoginActive,
    isRegisterActive,
  };
};

export default useNavigation;