import NotificationOnboarding from "./NotificationOnboarding";
import { render, screen } from "../../test/test-utils";

describe("NotificationOnboarding", () => {
  const onComplete = jest.fn();
  const onSkip = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render onboarding content", () => {
    render(<NotificationOnboarding onComplete={onComplete} onSkip={onSkip} />);

    expect(screen.getByText("notificationsOnboardingTitle")).toBeTruthy();
    expect(screen.getByText("notificationsOnboardingDescription")).toBeTruthy();
    expect(screen.getByText("notificationsEnableButton")).toBeTruthy();
    expect(screen.getByText("notificationsSkipButton")).toBeTruthy();
  });
});
