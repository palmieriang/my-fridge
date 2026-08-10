import { Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

/**
 * Viewport-relative units for React Native
 */
export const vw = (percentage: number): number => {
  return (screenWidth * percentage) / 100;
};

export const vh = (percentage: number): number => {
  return (screenHeight * percentage) / 100;
};

/**
 * True when the device has a tablet-sized (sw600dp+) screen
 */
export const isTablet = Math.min(screenWidth, screenHeight) >= 600;

/**
 * Responsive dimensions based on screen size.
 * Viewport-derived values are capped so they don't balloon on tablets.
 */
export const responsive = {
  // Viewport units
  vw: (percentage: number) => vw(percentage),
  vh: (percentage: number) => vh(percentage),

  // Touch targets (Apple HIG & Material Design)
  minTouchTarget: Math.min(Math.max(44, vw(12)), 56),

  // Spacing
  containerPadding: Math.min(vw(3.5), 16),
  containerMargin: Math.min(vw(2.5), 12),

  // Component sizes
  buttonHeight: Math.min(Math.max(48, vh(6)), 56),
  modalWidth: Math.min(vw(90), 400),

  // Max width for screen content on large screens (forms, lists, settings)
  contentMaxWidth: 640,

  // Avatar sizes
  avatarSmall: Math.min(vw(12), 56),
  avatarMedium: Math.min(vw(20), 96),
  avatarLarge: Math.min(vw(40), 150),
} as const;
