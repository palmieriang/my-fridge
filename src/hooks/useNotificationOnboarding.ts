import { useState, useEffect } from "react";

import { getUserNotificationSettings } from "../../api/api";
import { useAuth } from "../store";

interface UseNotificationOnboardingReturn {
  isOnboardingVisible: boolean;
  showOnboarding: () => void;
  hideOnboarding: () => void;
  markOnboardingCompleted: () => void;
}

export const useNotificationOnboarding =
  (): UseNotificationOnboardingReturn => {
    const [isOnboardingVisible, setIsOnboardingVisible] = useState(false);
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
    const { authState } = useAuth();

    useEffect(() => {
      const userId = authState.user?.uid;
      if (!userId) {
        return;
      }

      const loadOnboardingStatus = async () => {
        try {
          const settings = await getUserNotificationSettings(userId);
          setHasCompletedOnboarding(settings.hasCompletedOnboarding || false);
        } catch (error) {
          console.error("Error loading onboarding status:", error);
        }
      };

      loadOnboardingStatus();
    }, [authState.user?.uid]);

    useEffect(() => {
      if (authState.userToken && !hasCompletedOnboarding) {
        const timer = setTimeout(() => {
          setIsOnboardingVisible(true);
        }, 1000);

        return () => clearTimeout(timer);
      }
    }, [authState.userToken, hasCompletedOnboarding]);

    const showOnboarding = () => setIsOnboardingVisible(true);
    const hideOnboarding = () => setIsOnboardingVisible(false);

    const markOnboardingCompleted = () => {
      setHasCompletedOnboarding(true);
      setIsOnboardingVisible(false);
    };

    return {
      isOnboardingVisible,
      showOnboarding,
      hideOnboarding,
      markOnboardingCompleted,
    };
  };
