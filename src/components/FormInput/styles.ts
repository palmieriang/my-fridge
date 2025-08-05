import { StyleSheet } from "react-native";

import { COLORS } from "../../constants/colors";
import { Typography } from "../../typography/responsive";
import { responsive } from "../../utils/responsive";

export default StyleSheet.create({
  inputContainer: {
    alignItems: "center",
    borderColor: COLORS.MEDIUM_DARK_GRAY,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: responsive.containerMargin,
    maxHeight: 56,
    overflow: "visible",
    position: "relative",
  },
  iconStyle: {
    alignItems: "center",
    borderRightColor: COLORS.MEDIUM_DARK_GRAY,
    borderRightWidth: StyleSheet.hairlineWidth,
    padding: 14,
  },
  input: {
    flex: 1,
    fontFamily: "OpenSans-Regular",
    fontSize: Typography.body,
    justifyContent: "center",
    padding: 14,
  },
  inputError: {
    borderColor: COLORS.ERROR,
    borderWidth: 1,
  },
  errorText: {
    position: "absolute",
    bottom: -20,
    color: COLORS.ERROR,
    fontFamily: "OpenSans-Regular",
    fontSize: Typography.caption,
  },
});
