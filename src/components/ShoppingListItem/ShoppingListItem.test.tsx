import { TouchableOpacity } from "react-native";

import ShoppingListItem from "./ShoppingListItem";
import { ShoppingItem } from "../../store/types";
import { fireEvent, render, screen } from "../../test/test-utils";

// Render swipeable as a plain view so right-actions are always visible
jest.mock("react-native-gesture-handler/ReanimatedSwipeable", () => {
  const { forwardRef } = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: forwardRef(({ children, renderRightActions }: any) => (
      <View>
        {renderRightActions?.()}
        {children}
      </View>
    )),
  };
});

const mockItem: ShoppingItem = {
  id: "1",
  name: "Milk",
  checked: false,
};

const defaultProps = {
  item: mockItem,
  isEditing: false,
  editingName: "",
  onToggle: jest.fn(),
  onDelete: jest.fn(),
  onStartEdit: jest.fn(),
  onEditNameChange: jest.fn(),
  onSaveEdit: jest.fn(),
};

describe("ShoppingListItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the item name", () => {
    render(<ShoppingListItem {...defaultProps} />);
    expect(screen.getByText("Milk")).toBeTruthy();
  });

  it("renders the delete action button", () => {
    render(<ShoppingListItem {...defaultProps} />);
    expect(screen.getByText("delete")).toBeTruthy();
  });

  it("calls onDelete when the delete button is pressed", () => {
    render(<ShoppingListItem {...defaultProps} />);
    fireEvent.press(screen.getByText("delete"));
    expect(defaultProps.onDelete).toHaveBeenCalledTimes(1);
  });

  it("calls onStartEdit when the item name is pressed", () => {
    render(<ShoppingListItem {...defaultProps} />);
    fireEvent.press(screen.getByText("Milk"));
    expect(defaultProps.onStartEdit).toHaveBeenCalledTimes(1);
  });

  it("calls onToggle when the checkbox is pressed", () => {
    render(<ShoppingListItem {...defaultProps} />);
    const buttons = screen.UNSAFE_getAllByType(TouchableOpacity);
    fireEvent.press(buttons[1]);
    expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
  });

  it("shows a TextInput instead of name text when editing", () => {
    render(<ShoppingListItem {...defaultProps} isEditing editingName="Mil" />);
    expect(screen.getByDisplayValue("Mil")).toBeTruthy();
    expect(screen.queryByText("Milk")).toBeNull();
  });

  it("calls onEditNameChange when typing in the edit input", () => {
    render(<ShoppingListItem {...defaultProps} isEditing editingName="Milk" />);
    fireEvent.changeText(screen.getByDisplayValue("Milk"), "Butter");
    expect(defaultProps.onEditNameChange).toHaveBeenCalledWith("Butter");
  });

  it("calls onSaveEdit when the edit input is submitted", () => {
    render(<ShoppingListItem {...defaultProps} isEditing editingName="Milk" />);
    fireEvent(screen.getByDisplayValue("Milk"), "submitEditing");
    expect(defaultProps.onSaveEdit).toHaveBeenCalledTimes(1);
  });

  it("calls onSaveEdit when the edit input loses focus", () => {
    render(<ShoppingListItem {...defaultProps} isEditing editingName="Milk" />);
    fireEvent(screen.getByDisplayValue("Milk"), "blur");
    expect(defaultProps.onSaveEdit).toHaveBeenCalledTimes(1);
  });

  it("applies strikethrough style when the item is checked", () => {
    const checkedItem = { ...mockItem, checked: true };
    render(<ShoppingListItem {...defaultProps} item={checkedItem} />);
    const nameText = screen.getByText("Milk");
    expect(nameText.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ textDecorationLine: "line-through" }),
      ]),
    );
  });

  it("does not apply strikethrough style when the item is unchecked", () => {
    render(<ShoppingListItem {...defaultProps} />);
    const nameText = screen.getByText("Milk");
    const flatStyle = [nameText.props.style].flat();
    expect(flatStyle).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ textDecorationLine: "line-through" }),
      ]),
    );
  });
});
