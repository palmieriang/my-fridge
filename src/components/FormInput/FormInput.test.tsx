import FormInput from "./FormInput";
import { render, screen, fireEvent } from "../../test/test-utils";

const MockIcon = () => null;

describe("FormInput", () => {
  it("should render with placeholder text", () => {
    render(
      <FormInput
        labelValue=""
        placeholderText="Enter email"
        Icon={MockIcon}
        onChangeText={() => {}}
      />,
    );

    expect(screen.getByPlaceholderText("Enter email")).toBeTruthy();
  });

  it("should display the current value", () => {
    render(
      <FormInput
        labelValue="test@example.com"
        placeholderText="Enter email"
        Icon={MockIcon}
        onChangeText={() => {}}
      />,
    );

    expect(screen.getByDisplayValue("test@example.com")).toBeTruthy();
  });

  it("should call onChangeText when text changes", () => {
    const onChangeTextMock = jest.fn();
    render(
      <FormInput
        labelValue=""
        placeholderText="Enter email"
        Icon={MockIcon}
        onChangeText={onChangeTextMock}
      />,
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Enter email"),
      "new@email.com",
    );

    expect(onChangeTextMock).toHaveBeenCalledWith("new@email.com");
  });

  it("should show error styling when showError is true", () => {
    render(
      <FormInput
        labelValue=""
        placeholderText="Enter email"
        Icon={MockIcon}
        onChangeText={() => {}}
        showError
        error="Invalid email"
      />,
    );

    expect(screen.getByPlaceholderText("Enter email")).toBeTruthy();
  });

  it("should show password toggle button when showPasswordToggle is true", () => {
    const onToggleMock = jest.fn();
    render(
      <FormInput
        labelValue="password123"
        placeholderText="Enter password"
        Icon={MockIcon}
        onChangeText={() => {}}
        showPasswordToggle
        isPasswordVisible={false}
        onTogglePasswordVisibility={onToggleMock}
      />,
    );
    const toggleButton = screen.getByLabelText("showPassword");
    fireEvent.press(toggleButton);

    expect(onToggleMock).toHaveBeenCalledTimes(1);
  });
});
