'use client';

import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

const useNavigation = () => {
  const pathname = usePathname();
  const [isHomeActive, setIsHomeActive] = useState(false);
  const [isDiscoverActive, setIsDiscoverActive] = useState(false);
  const [isProfileActive, setIsProfileActive] = useState(false);
  const [isSettingsActive, setIsSettingsActive] = useState(false);
  const [isFeedActive, setIsFeedActive] = useState(false);
  const [isNewActive, setIsNewActive] = useState(false);

  useEffect(() => {
    setIsHomeActive(false);
    setIsDiscoverActive(false);
    setIsFeedActive(false);
    setIsNewActive(false);

    switch (pathname) {
      case '/':
        setIsHomeActive(true);
        break;
      case '/discover':
        setIsDiscoverActive(true);
        break;
      case '/feed':
        setIsFeedActive(true);
        break;
      case '/feed/new':
        setIsNewActive(true);
        break;
      case '/profile':
        setIsProfileActive(true);
        break;
      case '/settings':
        setIsSettingsActive(true);
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
    isSettingsActive,
  };
};

export default useNavigation;