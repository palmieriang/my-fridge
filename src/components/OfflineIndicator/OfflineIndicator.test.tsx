import { OfflineIndicator } from "./OfflineIndicator";
import { useNetwork } from "../../store/networkContext";
import { render, screen } from "../../test/test-utils";

jest.mock("../../store/networkContext", () => ({
  useNetwork: jest.fn(),
}));

const mockUseNetwork = useNetwork as jest.Mock;

describe("OfflineIndicator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render nothing when online", () => {
    mockUseNetwork.mockReturnValue({
      isConnected: true,
      isInternetReachable: true,
    });
    const { toJSON } = render(<OfflineIndicator />);

    expect(toJSON()).toBeNull();
  });

  it("should show offline message when not connected", () => {
    mockUseNetwork.mockReturnValue({
      isConnected: false,
      isInternetReachable: false,
    });
    render(<OfflineIndicator />);

    expect(screen.getByText("offlineMessage")).toBeTruthy();
    expect(screen.getByText("📡")).toBeTruthy();
  });

  it("should show offline message when internet is not reachable", () => {
    mockUseNetwork.mockReturnValue({
      isConnected: true,
      isInternetReachable: false,
    });
    render(<OfflineIndicator />);

    expect(screen.getByText("offlineMessage")).toBeTruthy();
  });
});
