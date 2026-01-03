import { PlacePicker } from "./PlacePicker";
import { render, screen } from "../../test/test-utils";

jest.mock("../../constants", () => ({ FRIDGE: "fridge", FREEZER: "freezer" }));
jest.mock("../../constants/colors", () => ({ COLORS: { ERROR: "#f00" } }));

describe("PlacePicker", () => {
  const DummyIcon = () => null;

  it("should render picker component", () => {
    const onPlaceChange = jest.fn();
    const { toJSON } = render(
      <PlacePicker
        selectedPlace="fridge"
        onPlaceChange={onPlaceChange}
        Icon={DummyIcon}
      />,
    );

    expect(toJSON()).toBeTruthy();
  });

  it("should show error text if error prop is set", () => {
    render(
      <PlacePicker
        selectedPlace=""
        onPlaceChange={jest.fn()}
        error="error!"
        Icon={DummyIcon}
      />,
    );

    expect(screen.getByText("error!")).toBeTruthy();
  });
});
