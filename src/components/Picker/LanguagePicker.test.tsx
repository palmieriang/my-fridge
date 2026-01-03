import { LanguagePicker } from "./LanguagePicker";
import { render, screen } from "../../test/test-utils";

describe("LanguagePicker", () => {
  it("should render language picker label", () => {
    const onLanguageChange = jest.fn();
    render(
      <LanguagePicker
        selectedLanguage="en"
        onLanguageChange={onLanguageChange}
      />,
    );

    expect(screen.getByText("changeLanguage")).toBeTruthy();
  });

  it("should call onLanguageChange when invoked", () => {
    const onLanguageChange = jest.fn();
    render(
      <LanguagePicker
        selectedLanguage="en"
        onLanguageChange={onLanguageChange}
      />,
    );

    onLanguageChange("es");
    expect(onLanguageChange).toHaveBeenCalledWith("es");
  });
});
