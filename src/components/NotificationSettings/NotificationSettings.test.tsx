import NotificationSettings from "./NotificationSettings";
import { render, screen } from "../../test/test-utils";

jest.mock("../../constants/colors", () => ({ COLORS: { WHITE: "#fff" } }));

describe("NotificationSettings", () => {
  it("should render notification settings and switch", () => {
    render(<NotificationSettings />);

    expect(
      screen.getAllByText(/notificationsPushNotifications/).length,
    ).toBeGreaterThan(0);
  });
});
