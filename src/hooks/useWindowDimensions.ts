import { useState, useEffect } from "react";
import { Dimensions } from "react-native";

interface WindowDimensions {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
}

/**
 * Modern hook for responsive dimensions
 * Properly handles orientation changes and font scaling
 */
export const useWindowDimensions = (): WindowDimensions => {
  const [dimensions, setDimensions] = useState(() => {
    const window = Dimensions.get("window");
    return {
      width: window.width,
      height: window.height,
      scale: window.scale,
      fontScale: window.fontScale,
    };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height,
        scale: window.scale,
        fontScale: window.fontScale,
      });
    });

    return () => subscription?.remove();
  }, []);

  return dimensions;
};

/**
 * Responsive breakpoints for different screen sizes
 */
export const Breakpoints = {
  sm: 576, // Small phones
  md: 768, // Large phones / small tablets
  lg: 992, // Tablets
  xl: 1200, // Large tablets / small desktops
} as const;

/**
 * Helper to determine screen size category
 */
export const useScreenSize = () => {
  const { width } = useWindowDimensions();

  return {
    isSmall: width < Breakpoints.sm,
    isMedium: width >= Breakpoints.sm && width < Breakpoints.md,
    isLarge: width >= Breakpoints.md && width < Breakpoints.lg,
    isExtraLarge: width >= Breakpoints.lg,
    width,
  };
};
