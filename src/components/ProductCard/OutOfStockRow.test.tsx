import OutOfStockRow from "./OutOfStockRow";
import { fireEvent, render, screen } from "../../test/test-utils";

describe("OutOfStockRow", () => {
  it("should render both labels", () => {
    render(
      <OutOfStockRow
        color="#e74c3c"
        outOfStockLabel="outOfStock"
        addToShoppingListLabel="addToShoppingList"
        onAddToShoppingList={() => {}}
      />,
    );

    expect(screen.getByText("outOfStock")).toBeTruthy();
    expect(screen.getByText("addToShoppingList")).toBeTruthy();
  });

  it("should call handler when add to shopping list label is pressed", () => {
    const onAddToShoppingList = jest.fn();

    render(
      <OutOfStockRow
        color="#e74c3c"
        outOfStockLabel="outOfStock"
        addToShoppingListLabel="addToShoppingList"
        onAddToShoppingList={onAddToShoppingList}
      />,
    );

    fireEvent.press(screen.getByText("addToShoppingList"));

    expect(onAddToShoppingList).toHaveBeenCalledTimes(1);
  });
});
