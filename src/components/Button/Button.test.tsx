import Button from "./Button";
import { render, screen, fireEvent } from "../../test/test-utils";

describe("Button", () => {
  it("should render with the correct text", () => {
    render(<Button text="Click me" onPress={() => {}} />);

    expect(screen.getByText("Click me")).toBeTruthy();
  });

  it("should call onPress when pressed", () => {
    const onPressMock = jest.fn();
    render(<Button text="Click me" onPress={onPressMock} />);

    fireEvent.press(screen.getByText("Click me"));

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it("should not call onPress when disabled", () => {
    const onPressMock = jest.fn();
    render(<Button text="Click me" onPress={onPressMock} disabled />);

    fireEvent.press(screen.getByText("Click me"));

    expect(onPressMock).not.toHaveBeenCalled();
  });
});
