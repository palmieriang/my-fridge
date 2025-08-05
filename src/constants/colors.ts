export const COLORS = {
  // Primary brand colors
  PRIMARY_RED: "#e74c3c",
  PRIMARY_BLUE: "#48bbec",

  // Neutral colors
  WHITE: "#ffffff",
  BLACK: "#000000",
  LIGHT_BACKGROUND: "#F3F3F3",
  DARK_BACKGROUND: "#131313",
  DARK_FOREGROUND: "#242424",

  // Gray scale
  LIGHT_GRAY: "#f8f8f8",
  MEDIUM_LIGHT_GRAY: "#e0e0e0",
  MEDIUM_DARK_GRAY: "#ccc",
  DARK_GRAY: "#999",

  // Status colors
  ERROR: "#dd2c00",

  // Social/External
  GOOGLE_RED: "#ea4335",
} as const;

export type ColorKey = keyof typeof COLORS;
