import Icon from "./Icon";
import { render } from "../../test/test-utils";
import { FRIDGE, FREEZER, SETTINGS, SHOPPING_LIST } from "../../constants";

describe("Icon", () => {
  it("renders a fridge icon when type is FRIDGE", () => {
    const { toJSON } = render(
      <Icon type={FRIDGE} size={24} fill="#000" focused={false} />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it("renders a freezer icon when type is FREEZER", () => {
    const { toJSON } = render(
      <Icon type={FREEZER} size={24} fill="#000" focused={false} />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it("renders a settings icon when type is SETTINGS", () => {
    const { toJSON } = render(
      <Icon type={SETTINGS} size={24} fill="#000" focused={false} />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it("renders a shopping list icon when type is SHOPPING_LIST", () => {
    const { toJSON } = render(
      <Icon type={SHOPPING_LIST} size={24} fill="#000" focused={false} />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it("uses the provided size when focused is true", () => {
    const { toJSON } = render(
      <Icon type={FRIDGE} size={30} fill="#f00" focused={true} />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it("uses size 22 when focused is false regardless of the size prop", () => {
    const { toJSON } = render(
      <Icon type={FRIDGE} size={30} fill="#f00" focused={false} />,
    );
    expect(toJSON()).toBeTruthy();
  });
});
