import { StyleSheet } from "react-native";

import { COLORS } from "../../constants/colors";
import { Typography } from "../../typography/responsive";
import { responsive } from "../../utils/responsive";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: responsive.containerMargin,
    marginTop: 16,
    marginBottom: 8,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontFamily: "OpenSans-Regular",
    fontSize: Typography.body,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.MEDIUM_DARK_GRAY,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  addButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 4,
  },
  addButtonText: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: Typography.body,
    color: COLORS.WHITE,
  },
  list: {
    flex: 1,
  },
  clearButton: {
    margin: responsive.containerMargin,
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: "center",
  },
  clearButtonText: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: Typography.body,
  },
  emptyText: {
    textAlign: "center",
    fontFamily: "OpenSans-Regular",
    fontSize: Typography.body,
    marginTop: 50,
    paddingHorizontal: 20,
    opacity: 0.6,
  },
  sectionLabel: {
    fontFamily: "OpenSans-Light",
    fontSize: Typography.caption,
    textTransform: "uppercase",
    marginHorizontal: responsive.containerMargin,
    marginTop: 12,
    marginBottom: 2,
    opacity: 0.5,
  },
});
