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
  container: {
    alignItems: "center",
    borderColor: COLORS.MEDIUM_DARK_GRAY,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    marginHorizontal: responsive.containerMargin,
    marginTop: 10,
    maxHeight: 56,
    overflow: "visible",
    position: "relative",
  },
  containerError: {
    borderColor: COLORS.ERROR,
    borderWidth: 1,
  },
  iconStyle: {
    alignItems: "center",
    borderRightColor: COLORS.MEDIUM_DARK_GRAY,
    borderRightWidth: StyleSheet.hairlineWidth,
    padding: 14,
  },
  picker: {
    flex: 1,
    fontSize: Typography.caption,
  },
  iosHeight: {
    height: responsive.minTouchTarget,
  },
  errorText: {
    position: "absolute",
    bottom: -18,
    left: 0,
    color: COLORS.ERROR,
    fontSize: Typography.caption,
    fontFamily: "OpenSans-Regular",
  },
});
