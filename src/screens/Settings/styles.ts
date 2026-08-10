import { StyleSheet } from "react-native";

import { responsive } from "../../utils/responsive";

export default StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  contentContainer: {
    paddingBottom: 28,
    width: "100%",
    maxWidth: responsive.contentMaxWidth,
    alignSelf: "center",
  },
  tutorialRow: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  tutorialTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },
  tutorialDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
});
