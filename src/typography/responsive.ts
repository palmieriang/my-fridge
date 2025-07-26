import { PixelRatio } from "react-native";

/**
 * Modern responsive font sizing system
 */
export const FontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
} as const;

/**
 * Responsive font scaling with accessibility support
 */
export const responsiveFont = (size: number): number => {
  const scale = PixelRatio.getFontScale();
  const pixelRatio = PixelRatio.get();

  const normalizedSize = size * (pixelRatio > 2 ? 1 : pixelRatio / 2);
  return Math.round(normalizedSize * scale);
};

export const Typography = {
  caption: responsiveFont(FontSizes.xs),
  body: responsiveFont(FontSizes.sm),
  bodyLarge: responsiveFont(FontSizes.base),
  subtitle: responsiveFont(FontSizes.lg),
  title: responsiveFont(FontSizes.xl),
  headline: responsiveFont(FontSizes["2xl"]),
  display: responsiveFont(FontSizes["3xl"]),
} as const;

export type TypographyKey = keyof typeof Typography;
