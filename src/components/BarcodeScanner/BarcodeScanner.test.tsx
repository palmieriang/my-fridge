import { BarcodeScanner } from "./BarcodeScanner";
import { render, screen } from "../../test/test-utils";

jest.mock("expo-camera", () => ({
  CameraView: ({ children }: any) => children,
  useCameraPermissions: () => [{ granted: true }, jest.fn()],
}));

describe("BarcodeScanner", () => {
  it("should render modal when visible", () => {
    render(
      <BarcodeScanner
        visible
        onClose={jest.fn()}
        onBarcodeScanned={jest.fn()}
      />,
    );

    expect(screen.getByText("scanBarcode")).toBeTruthy();
  });

  it("should render cancel button", () => {
    render(
      <BarcodeScanner
        visible
        onClose={jest.fn()}
        onBarcodeScanned={jest.fn()}
      />,
    );

    expect(screen.getByText("cancel")).toBeTruthy();
  });
});
