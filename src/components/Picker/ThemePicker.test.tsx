import { ThemePicker } from "./ThemePicker";
import { render, screen } from "../../test/test-utils";

jest.mock("./generateThemeData", () => ({
  generateThemeData: () => [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
  ],
}));

describe("ThemePicker", () => {
  it("should render theme picker label", () => {
    const onThemeChange = jest.fn();
    render(<ThemePicker selectedTheme="light" onThemeChange={onThemeChange} />);

    expect(screen.getByText("changeTheme")).toBeTruthy();
  });

  it("should call onThemeChange when invoked", () => {
    const onThemeChange = jest.fn();
    render(<ThemePicker selectedTheme="light" onThemeChange={onThemeChange} />);

    onThemeChange("dark");
    expect(onThemeChange).toHaveBeenCalledWith("dark");
  });
});
