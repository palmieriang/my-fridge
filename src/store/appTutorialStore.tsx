import { useEffect, useMemo, useState, ReactNode } from "react";

import { AppTutorialStoreContext } from "./contexts";
import { useAuth } from "./hooks";
import type {
  AppTutorialContextMethods,
  AppTutorialStateType,
  AppTutorialStoreValue,
} from "./types";
import {
  getUserAppTutorialSettings,
  updateUserAppTutorialSettings,
} from "../../api/api";

const { Provider } = AppTutorialStoreContext;

const initialState: AppTutorialStateType = {
  loading: true,
  isActive: false,
  currentStep: 0,
  hasCompleted: false,
  hasDismissed: false,
  shouldShowResumePrompt: false,
  isManualStartRequested: false,
};

const APP_TUTORIAL_FIRST_STEP = 0;

const AppTutorialProvider = ({ children }: { children: ReactNode }) => {
  const { authState } = useAuth();
  const userId = authState.user?.uid;

  const [appTutorialState, setAppTutorialState] =
    useState<AppTutorialStateType>(initialState);

  useEffect(() => {
    if (!userId) {
      setAppTutorialState(initialState);
      return;
    }

    let isMounted = true;

    const loadTutorialSettings = async () => {
      try {
        const settings = await getUserAppTutorialSettings(userId);

        if (!isMounted) {
          return;
        }

        const shouldShowResumePrompt =
          !settings.hasCompletedAppTutorial &&
          !settings.hasDismissedAppTutorial &&
          (settings.appTutorialCurrentStep ?? APP_TUTORIAL_FIRST_STEP) >
            APP_TUTORIAL_FIRST_STEP;

        setAppTutorialState((prev) => ({
          ...prev,
          loading: false,
          isActive: false,
          currentStep:
            settings.appTutorialCurrentStep ?? APP_TUTORIAL_FIRST_STEP,
          hasCompleted: settings.hasCompletedAppTutorial,
          hasDismissed: settings.hasDismissedAppTutorial,
          shouldShowResumePrompt,
        }));
      } catch (error) {
        console.error("Error loading app tutorial settings:", error);
        if (isMounted) {
          setAppTutorialState((prev) => ({ ...prev, loading: false }));
        }
      }
    };

    loadTutorialSettings();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const persistTutorialState = async (data: {
    hasCompletedAppTutorial?: boolean;
    hasDismissedAppTutorial?: boolean;
    appTutorialCurrentStep?: number;
  }) => {
    if (!userId) {
      return;
    }

    await updateUserAppTutorialSettings(userId, data);
  };

  const appTutorialContext: AppTutorialContextMethods = useMemo(
    () => ({
      requestManualStart: () => {
        setAppTutorialState((prev) => ({
          ...prev,
          isManualStartRequested: true,
          shouldShowResumePrompt: false,
          hasDismissed: false,
        }));
      },
      clearManualStartRequest: () => {
        setAppTutorialState((prev) => ({
          ...prev,
          isManualStartRequested: false,
        }));
      },
      startTutorial: async () => {
        await persistTutorialState({
          hasDismissedAppTutorial: false,
          appTutorialCurrentStep: APP_TUTORIAL_FIRST_STEP,
        });

        setAppTutorialState((prev) => ({
          ...prev,
          isActive: true,
          currentStep: APP_TUTORIAL_FIRST_STEP,
          hasDismissed: false,
          shouldShowResumePrompt: false,
          isManualStartRequested: false,
        }));
      },
      restartTutorial: async () => {
        await persistTutorialState({
          hasCompletedAppTutorial: false,
          hasDismissedAppTutorial: false,
          appTutorialCurrentStep: APP_TUTORIAL_FIRST_STEP,
        });

        setAppTutorialState((prev) => ({
          ...prev,
          isActive: true,
          currentStep: APP_TUTORIAL_FIRST_STEP,
          hasCompleted: false,
          hasDismissed: false,
          shouldShowResumePrompt: false,
          isManualStartRequested: false,
        }));
      },
      resumeTutorial: async () => {
        await persistTutorialState({
          hasDismissedAppTutorial: false,
        });

        setAppTutorialState((prev) => ({
          ...prev,
          isActive: true,
          hasDismissed: false,
          shouldShowResumePrompt: false,
          isManualStartRequested: false,
        }));
      },
      goToStep: async (step: number) => {
        await persistTutorialState({
          appTutorialCurrentStep: step,
          hasDismissedAppTutorial: false,
        });

        setAppTutorialState((prev) => ({
          ...prev,
          isActive: true,
          currentStep: step,
          hasDismissed: false,
          shouldShowResumePrompt: false,
        }));
      },
      completeTutorial: async () => {
        await persistTutorialState({
          hasCompletedAppTutorial: true,
          hasDismissedAppTutorial: false,
          appTutorialCurrentStep: APP_TUTORIAL_FIRST_STEP,
        });

        setAppTutorialState((prev) => ({
          ...prev,
          isActive: false,
          currentStep: APP_TUTORIAL_FIRST_STEP,
          hasCompleted: true,
          hasDismissed: false,
          shouldShowResumePrompt: false,
          isManualStartRequested: false,
        }));
      },
      dismissTutorial: async () => {
        await persistTutorialState({
          hasDismissedAppTutorial: true,
        });

        setAppTutorialState((prev) => ({
          ...prev,
          isActive: false,
          hasDismissed: true,
          shouldShowResumePrompt: false,
          isManualStartRequested: false,
        }));
      },
      postponeTutorial: () => {
        setAppTutorialState((prev) => ({
          ...prev,
          isActive: false,
          shouldShowResumePrompt: true,
        }));
      },
    }),
    [userId],
  );

  const value: AppTutorialStoreValue = {
    appTutorialState,
    appTutorialContext,
  };

  return <Provider value={value}>{children}</Provider>;
};

export { AppTutorialStoreContext as appTutorialStore, AppTutorialProvider };
