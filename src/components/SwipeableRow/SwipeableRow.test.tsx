import { Text } from "react-native";

import SwipeableRow from "./SwipeableRow";
import { render } from "../../test/test-utils";

jest.mock("react-native-gesture-handler/ReanimatedSwipeable", () => {
  const { forwardRef } = require("react");
  return forwardRef((_props: any, _ref: any) => _props.children);
});

jest.mock("./SwipeAction", () => () => null);

describe("SwipeableRow", () => {
  it("should render children", () => {
    const modifyFunction = jest.fn();
    const deleteFunction = jest.fn();
    const freezeFunction = jest.fn();
    const { getByText } = render(
      <SwipeableRow
        modifyFunction={modifyFunction}
        deleteFunction={deleteFunction}
        freezeFunction={freezeFunction}
        place="fridge"
      >
        <Text>child</Text>
      </SwipeableRow>,
    );

    expect(getByText("child")).toBeTruthy();
  });
});
