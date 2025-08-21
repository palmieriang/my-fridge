import { StyleSheet } from "react-native";

import { COLORS } from "../../constants/colors";
import { Typography } from "../../typography/responsive";
import { responsive } from "../../utils/responsive";

export default StyleSheet.create({
  label: {
    fontSize: Typography.body,
    fontFamily: "OpenSans-SemiBold",
    marginHorizontal: responsive.containerMargin,
    marginTop: 20,
    marginBottom: 8,
  },
  selectorContainer: {
    alignItems: "center",
    borderColor: COLORS.MEDIUM_DARK_GRAY,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    marginHorizontal: responsive.containerMargin,
    marginTop: 0,
    minWidth: 200,
    overflow: "hidden",
  },
  iconStyle: {
    alignItems: "center",
    borderRightColor: COLORS.MEDIUM_DARK_GRAY,
    borderRightWidth: StyleSheet.hairlineWidth,
    padding: 14,
  },
  picker: {
    flex: 1,
  },
});
