import PasswordStrengthIndicator from "./PasswordStrengthIndicator";
import { render, screen } from "../../test/test-utils";

jest.mock("../../utils/validation", () => ({
  getPasswordStrength: jest.fn((password, colorScheme) => {
    if (password.length < 4) {
      return { strength: 1, color: colorScheme.weak, text: "Weak" };
    } else if (password.length < 8) {
      return { strength: 2, color: colorScheme.fair, text: "Fair" };
    } else if (password.length < 12) {
      return { strength: 3, color: colorScheme.good, text: "Good" };
    } else {
      return { strength: 4, color: colorScheme.strong, text: "Strong" };
    }
  }),
}));

describe("PasswordStrengthIndicator", () => {
  it("should render nothing when password is empty", () => {
    const { toJSON } = render(<PasswordStrengthIndicator password="" />);

    expect(toJSON()).toBeNull();
  });

  it("should show weak indicator for short passwords", () => {
    render(<PasswordStrengthIndicator password="abc" />);

    expect(screen.getByText("Weak")).toBeTruthy();
  });

  it("should show fair indicator for medium passwords", () => {
    render(<PasswordStrengthIndicator password="abcdef" />);

    expect(screen.getByText("Fair")).toBeTruthy();
  });

  it("should show good indicator for good passwords", () => {
    render(<PasswordStrengthIndicator password="abcdefgh" />);

    expect(screen.getByText("Good")).toBeTruthy();
  });

  it("should show strong indicator for long passwords", () => {
    render(<PasswordStrengthIndicator password="abcdefghijklmnop" />);

    expect(screen.getByText("Strong")).toBeTruthy();
  });
});
