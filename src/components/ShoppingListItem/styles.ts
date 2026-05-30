import { StyleSheet } from "react-native";

import { COLORS } from "../../constants/colors";
import { Typography } from "../../typography/responsive";
import { responsive } from "../../utils/responsive";

export default StyleSheet.create({
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: responsive.containerPadding,
    marginHorizontal: responsive.containerMargin,
    marginVertical: 3,
    borderRadius: 4,
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.MEDIUM_DARK_GRAY,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  itemText: {
    flex: 1,
    fontFamily: "OpenSans-Regular",
    fontSize: Typography.bodyLarge,
  },
  itemTextChecked: {
    textDecorationLine: "line-through",
    opacity: 0.45,
  },
  editInput: {
    flex: 1,
    fontFamily: "OpenSans-Regular",
    fontSize: Typography.bodyLarge,
    padding: 0,
  },
  deleteAction: {
    width: 80,
    marginVertical: 3,
    marginRight: responsive.containerMargin,
    borderRadius: 4,
    overflow: "hidden",
    justifyContent: "center",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#dd2c00",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: Typography.caption,
    color: COLORS.WHITE,
    textTransform: "uppercase",
  },
});
