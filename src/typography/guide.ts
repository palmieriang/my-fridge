/**
 * Font Usage Guide for My Fridge App
 *
 * Use this guide to maintain consistent typography throughout the app.
 * All font sizes are responsive and respect user accessibility settings.
 */

import { Typography } from "./responsive";

/**
 * Font Usage Guidelines:
 *
 * Typography.caption (12px base)
 * - Use for: Small labels, timestamps, secondary information
 * - Examples: "2 days left", "Created on", form field hints
 *
 * Typography.body (14px base)
 * - Use for: Form inputs, body text, descriptions
 * - Examples: Input fields, product descriptions, settings labels
 *
 * Typography.bodyLarge (16px base)
 * - Use for: Button text, main content, list items
 * - Examples: Button labels, main text content, navigation items
 *
 * Typography.subtitle (18px base)
 * - Use for: Section headers, navigation titles
 * - Examples: Tab bar labels, screen titles
 *
 * Typography.title (20px base)
 * - Use for: Page titles, modal headers
 * - Examples: "My Fridge", "Add Product", modal titles
 *
 * Typography.headline (24px base)
 * - Use for: Major section titles, onboarding headers
 * - Examples: Welcome messages, major feature headers
 *
 * Typography.display (32px base)
 * - Use for: Large numbers, counters, emphasis text
 * - Examples: Product counters, "EXPIRED" labels, large numbers
 */

// Example usage in styles:
export const ExampleStyles = {
  // ✅ Good - using semantic typography scale
  productTitle: {
    fontSize: Typography.bodyLarge, // Instead of adjust(16)
    fontFamily: "OpenSans-Regular",
  },

  productCounter: {
    fontSize: Typography.display, // Instead of adjust(32)
    fontFamily: "OpenSans-Bold",
  },

  timestamp: {
    fontSize: Typography.caption, // Instead of adjust(12)
    fontFamily: "OpenSans-Light",
  },

  // ❌ Avoid - raw numbers without scaling
  badExample: {
    fontSize: 16, // Don't do this
  },

  // ❌ Avoid - custom adjust function
  oldWay: {
    // fontSize: adjust(16), // Replace with Typography.bodyLarge
  },
};
