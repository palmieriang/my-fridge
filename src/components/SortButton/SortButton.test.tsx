import SortButton from "./SortButton";
import { render, screen } from "../../test/test-utils";

describe("SortButton", () => {
  it("should render correctly", () => {
    render(<SortButton sortOrder="default" onSortToggle={jest.fn()} />);
    expect(screen.root).toBeTruthy();
  });

  it("should render with different sort orders", () => {
    const { rerender } = render(
      <SortButton sortOrder="default" onSortToggle={jest.fn()} />,
    );
    expect(screen.root).toBeTruthy();

    rerender(<SortButton sortOrder="earlier" onSortToggle={jest.fn()} />);
    expect(screen.root).toBeTruthy();

    rerender(<SortButton sortOrder="later" onSortToggle={jest.fn()} />);
    expect(screen.root).toBeTruthy();
  });
});
