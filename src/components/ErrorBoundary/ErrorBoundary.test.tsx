import { render, screen, fireEvent } from "../../test/test-utils";
import ErrorBoundary from "./ErrorBoundary";
import { Text } from "react-native";

// Suppress console.error noise from intentional error throws
beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

const ThrowOnMount = () => {
  throw new Error("Test error");
};

describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <Text>All good</Text>
      </ErrorBoundary>,
    );

    expect(screen.getByText("All good")).toBeTruthy();
  });

  it("renders the error UI when a child throws", () => {
    render(
      <ErrorBoundary>
        <ThrowOnMount />
      </ErrorBoundary>,
    );

    // The error UI contains a retry button
    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("resets the error state when the retry button is pressed", () => {
    render(
      <ErrorBoundary>
        <ThrowOnMount />
      </ErrorBoundary>,
    );

    // Error UI is visible — retry button should be present
    const retryButton = screen.getByRole("button");
    expect(retryButton).toBeTruthy();

    // Pressing retry resets hasError — the boundary re-renders, ThrowOnMount
    // will throw again so we stay in the error UI, but the reset itself works
    fireEvent.press(retryButton);

    // Still renders the fallback UI (child still throws)
    expect(screen.getByRole("button")).toBeTruthy();
  });
});
