import { StyleSheet } from "react-native";

import { COLORS } from "../../constants/colors";
import { Typography } from "../../typography/responsive";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
    paddingTop: 48,
    paddingBottom: 32,
  },
  content: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  emoji: {
    fontSize: Typography.display,
    marginBottom: 24,
  },
  title: {
    fontSize: Typography.headline,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  description: {
    fontSize: Typography.bodyLarge,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  benefitsContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  benefit: {
    fontSize: Typography.bodyLarge,
    marginBottom: 12,
    lineHeight: 22,
    paddingLeft: 8,
    alignSelf: "flex-start",
  },
  buttonContainer: {
    paddingTop: 24,
    gap: 16,
  },
  enableButtonText: {
    color: COLORS.WHITE,
    fontSize: Typography.bodyLarge,
    fontWeight: "600",
    textAlign: "center",
  },
  skipButton: {
    fontSize: Typography.bodyLarge,
    textAlign: "center",
    paddingVertical: 12,
    opacity: 0.8,
  },
});

export default styles;
