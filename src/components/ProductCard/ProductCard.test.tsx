import ProductCard from "./ProductCard";
import { render, screen } from "../../test/test-utils";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe("ProductCard", () => {
  const mockProduct = {
    id: "1",
    name: "Test Milk",
    date: "2025-12-31",
    place: "fridge" as const,
  };

  it("should render product name", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText("Test Milk")).toBeTruthy();
  });

  it("should render formatted date", () => {
    render(<ProductCard product={mockProduct} />);

    // Date is formatted as "D MMM YYYY"
    expect(screen.getByText("31 Dec 2025")).toBeTruthy();
  });

  it("should render days label for non-expired products", () => {
    const futureProduct = {
      ...mockProduct,
      date: "2030-12-31",
    };
    render(<ProductCard product={futureProduct} />);

    // t("days").toUpperCase() returns "DAYS"
    expect(screen.getByText("DAYS")).toBeTruthy();
  });

  it("should render expired label for expired products", () => {
    const expiredProduct = {
      ...mockProduct,
      date: "2020-01-01",
    };
    render(<ProductCard product={expiredProduct} />);

    expect(screen.getByText("expired")).toBeTruthy();
  });
});
