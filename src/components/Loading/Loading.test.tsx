import Loading from "./Loading";
import { render, screen } from "../../test/test-utils";

describe("Loading", () => {
  it("should render the activity indicator", () => {
    render(<Loading />);

    expect(screen.getByTestId("activity-indicator")).toBeTruthy();
  });

  it("should render with custom size", () => {
    render(<Loading size="large" />);

    expect(screen.getByTestId("activity-indicator")).toBeTruthy();
  });

  it("should render with custom color", () => {
    render(<Loading color="#48bbec" />);

    expect(screen.getByTestId("activity-indicator")).toBeTruthy();
  });
});
