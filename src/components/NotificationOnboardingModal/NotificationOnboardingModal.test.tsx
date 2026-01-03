import { render } from "@testing-library/react-native";

import NotificationOnboardingModal from "./NotificationOnboardingModal";

jest.mock("../../hooks/useNotificationOnboarding", () => ({
  useNotificationOnboarding: () => ({
    isOnboardingVisible: true,
    hideOnboarding: jest.fn(),
  }),
}));
jest.mock("../NotificationOnboarding/NotificationOnboarding", () => () => (
  <></>
));

describe("NotificationOnboardingModal", () => {
  it("should render modal when onboarding is visible", () => {
    const { UNSAFE_getByType } = render(<NotificationOnboardingModal />);
    expect(UNSAFE_getByType(require("react-native").Modal)).toBeTruthy();
  });
});
