import FloatingButton from "./FloatingButton";
import { render, screen, fireEvent } from "../../test/test-utils";

describe("FloatingButton", () => {
  it("should render correctly", () => {
    render(<FloatingButton color="#e74c3c" onPress={() => {}} />);

    expect(screen.getByLabelText("Add item")).toBeTruthy();
  });

  it("should call onPress when pressed", () => {
    const onPressMock = jest.fn();
    render(<FloatingButton color="#e74c3c" onPress={onPressMock} />);
    fireEvent.press(screen.getByLabelText("Add item"));

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it("should apply the correct background color", () => {
    const testColor = "#48bbec";
    render(<FloatingButton color={testColor} onPress={jest.fn()} />);
    const button = screen.getByTestId("add-item-button");

    expect(button.props.style).toMatchObject({ backgroundColor: testColor });
  });
});
