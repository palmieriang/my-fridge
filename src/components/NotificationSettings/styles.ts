import { StyleSheet } from "react-native";

import { Typography } from "../../typography/responsive";

const styles = StyleSheet.create({
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: Typography.bodyLarge,
    fontWeight: "600",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: Typography.body,
    opacity: 0.8,
  },
  switchContainer: {
    transform: [{ scale: 1.15 }],
    padding: 8,
    borderRadius: 24,
  },
});

export default styles;
