import { StyleSheet } from "react-native";

import { COLORS } from "../../constants/colors";
import { Typography } from "../../typography/responsive";
import { responsive } from "../../utils/responsive";

export default StyleSheet.create({
  container: {
    borderColor: COLORS.MEDIUM_DARK_GRAY,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: responsive.containerMargin,
    overflow: "visible",
    position: "relative",
  },
  containerError: {
    borderColor: COLORS.ERROR,
    borderWidth: 1,
  },
  picker: {
    fontSize: Typography.caption,
  },
  iosHeight: {
    height: responsive.minTouchTarget,
  },
  errorText: {
    position: "absolute",
    bottom: -20,
    left: 0,
    color: COLORS.ERROR,
    fontSize: Typography.caption,
    fontFamily: "OpenSans-Regular",
  },
});
