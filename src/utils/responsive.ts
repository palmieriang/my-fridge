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
 * Responsive dimensions based on screen size
 */
export const responsive = {
  // Viewport units
  vw: (percentage: number) => vw(percentage),
  vh: (percentage: number) => vh(percentage),

  // Touch targets (Apple HIG & Material Design)
  minTouchTarget: Math.max(44, vw(12)),

  // Spacing
  containerPadding: vw(3.5),
  containerMargin: vw(2.5),

  // Component sizes
  buttonHeight: Math.max(48, vh(6)),
  modalWidth: Math.min(vw(90), 400),

  // Avatar sizes
  avatarSmall: vw(12),
  avatarMedium: vw(20),
  avatarLarge: Math.min(vw(40), 150),
} as const;
