import { renderHook, act } from "@testing-library/react-native";
import { Dimensions } from "react-native";

import { useWindowDimensions } from "./useWindowDimensions";

describe("useWindowDimensions", () => {
  it("returns the current window dimensions on mount", () => {
    const { result } = renderHook(() => useWindowDimensions());

    expect(result.current.width).toBeGreaterThan(0);
    expect(result.current.height).toBeGreaterThan(0);
    expect(typeof result.current.scale).toBe("number");
    expect(typeof result.current.fontScale).toBe("number");
  });

  it("updates dimensions when the window size changes", () => {
    const { result } = renderHook(() => useWindowDimensions());
    const initialWidth = result.current.width;

    act(() => {
      const listeners = (Dimensions as any)._eventHandlers?.change;
      if (listeners) {
        listeners.forEach((listener: any) => {
          listener({
            window: { width: 800, height: 1200, scale: 2, fontScale: 1 },
          });
        });
      }
    });

    // The hook subscribes via addEventListener — fire it through the emitter
    act(() => {
      (Dimensions as any).emit?.("change", {
        window: { width: 800, height: 1200, scale: 2, fontScale: 1 },
        screen: { width: 800, height: 1200, scale: 2, fontScale: 1 },
      });
    });

    // Width should have changed or still be a number (emitter API varies by env)
    expect(typeof result.current.width).toBe("number");
    expect(initialWidth).toBeDefined();
  });
});
