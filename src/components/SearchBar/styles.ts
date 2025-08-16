import { StyleSheet } from "react-native";

import { COLORS } from "../../constants/colors";
import { Typography } from "../../typography/responsive";

export default StyleSheet.create({
  searchContainer: {
    flex: 1,
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderRadius: 4,
    paddingHorizontal: 15,
    paddingRight: 45,
    borderWidth: 1,
    borderColor: COLORS.MEDIUM_LIGHT_GRAY,
    fontSize: Typography.body,
    fontFamily: "OpenSans-Regular",
  },
  clearButton: {
    position: "absolute",
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.MEDIUM_DARK_GRAY,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    color: COLORS.WHITE,
    fontSize: Typography.body,
    fontWeight: "bold",
  },
});
