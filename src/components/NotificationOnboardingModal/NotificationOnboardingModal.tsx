import { FC } from "react";
import { Modal } from "react-native";

import { useNotificationOnboarding } from "../../hooks/useNotificationOnboarding";
import NotificationOnboarding from "../NotificationOnboarding/NotificationOnboarding";

const NotificationOnboardingModal: FC = () => {
  const { isOnboardingVisible, hideOnboarding } = useNotificationOnboarding();

  return (
    <Modal
      visible={isOnboardingVisible}
      transparent
      animationType="slide"
      onRequestClose={hideOnboarding}
    >
      <NotificationOnboarding onComplete={hideOnboarding} />
    </Modal>
  );
};

export default NotificationOnboardingModal;
