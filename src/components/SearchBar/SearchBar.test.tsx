import SearchBar from "./SearchBar";
import { render, screen, fireEvent } from "../../test/test-utils";

describe("SearchBar", () => {
  it("renders with placeholder text", () => {
    render(
      <SearchBar
        value=""
        onChangeText={() => {}}
        placeholder="Search products"
      />,
    );

    expect(screen.getByPlaceholderText("Search products")).toBeTruthy();
  });

  it("displays the current value", () => {
    render(<SearchBar value="milk" onChangeText={() => {}} />);

    expect(screen.getByDisplayValue("milk")).toBeTruthy();
  });

  it("calls onChangeText when text changes", () => {
    const onChangeTextMock = jest.fn();
    render(<SearchBar value="" onChangeText={onChangeTextMock} />);

    fireEvent.changeText(screen.getByPlaceholderText("search"), "cheese");

    expect(onChangeTextMock).toHaveBeenCalledWith("cheese");
  });

  it("shows clear button when value is not empty", () => {
    render(<SearchBar value="milk" onChangeText={() => {}} />);

    expect(screen.getByText("✕")).toBeTruthy();
  });

  it("does not show clear button when value is empty", () => {
    render(<SearchBar value="" onChangeText={() => {}} />);

    expect(screen.queryByText("✕")).toBeNull();
  });

  it("clears input when clear button is pressed", () => {
    const onChangeTextMock = jest.fn();
    render(<SearchBar value="milk" onChangeText={onChangeTextMock} />);

    fireEvent.press(screen.getByText("✕"));

    expect(onChangeTextMock).toHaveBeenCalledWith("");
  });
});
