import { ThemePicker } from "./ThemePicker";
import { generateThemeData } from "./generateThemeData";
import { render, screen } from "../../test/test-utils";

describe("ThemePicker", () => {
  it("should render theme picker label", () => {
    const onThemeChange = jest.fn();
    render(
      <ThemePicker selectedTheme="lightRed" onThemeChange={onThemeChange} />,
    );

    expect(screen.getByText("changeTheme")).toBeTruthy();
  });

  it("should generate localized theme labels", () => {
    const translate = jest.fn((scope: string) => `translated:${scope}`);

    expect(
      generateThemeData({ availableThemes: ["lightRed"], translate }),
    ).toEqual([
      {
        key: "lightRed",
        label: "translated:lightRed",
        value: "lightRed",
      },
    ]);
  });

  it("should call onThemeChange when invoked", () => {
    const onThemeChange = jest.fn();
    render(
      <ThemePicker selectedTheme="lightRed" onThemeChange={onThemeChange} />,
    );

    onThemeChange("darkRed");
    expect(onThemeChange).toHaveBeenCalledWith("darkRed");
  });
});
