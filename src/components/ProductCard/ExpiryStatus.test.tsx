import ExpiryStatus from "./ExpiryStatus";
import { render, screen } from "../../test/test-utils";

describe("ExpiryStatus", () => {
  it("should render expired label when product is expired", () => {
    render(
      <ExpiryStatus
        expired
        days={-1}
        expiredLabel="expired"
        daysLabel="DAYS"
        primaryColor="#e74c3c"
        textColor="#000"
      />,
    );

    expect(screen.getByText("expired")).toBeTruthy();
    expect(screen.queryByText("DAYS")).toBeNull();
  });

  it("should render day count and label when product is not expired", () => {
    render(
      <ExpiryStatus
        expired={false}
        days={8}
        expiredLabel="expired"
        daysLabel="DAYS"
        primaryColor="#e74c3c"
        textColor="#000"
      />,
    );

    expect(screen.getByText("8")).toBeTruthy();
    expect(screen.getByText("DAYS")).toBeTruthy();
    expect(screen.queryByText("expired")).toBeNull();
  });
});
