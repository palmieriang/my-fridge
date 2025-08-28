import { useState, useEffect, useContext } from "react";

import { authStore } from "../store";

interface UseNotificationOnboardingReturn {
  isOnboardingVisible: boolean;
  showOnboarding: () => void;
  hideOnboarding: () => void;
}

export const useNotificationOnboarding =
  (): UseNotificationOnboardingReturn => {
    const [isOnboardingVisible, setIsOnboardingVisible] = useState(false);
    const [hasShownOnboarding, setHasShownOnboarding] = useState(false);
    const { authState } = useContext(authStore);

    useEffect(() => {
      if (authState.userToken && !hasShownOnboarding) {
        const timer = setTimeout(() => {
          setIsOnboardingVisible(true);
          setHasShownOnboarding(true);
        }, 1000);

        return () => clearTimeout(timer);
      }
    }, [authState.userToken, hasShownOnboarding]);

    const showOnboarding = () => setIsOnboardingVisible(true);
    const hideOnboarding = () => setIsOnboardingVisible(false);

    return {
      isOnboardingVisible,
      showOnboarding,
      hideOnboarding,
    };
  };
