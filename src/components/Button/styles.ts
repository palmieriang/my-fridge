import { StyleSheet } from "react-native";
import { COLORS } from "src/constants/colors";

import { Typography } from "../../typography/responsive";
import { responsive } from "../../utils/responsive";

export default StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 4,
    justifyContent: "center",
    height: responsive.minTouchTarget,
    marginHorizontal: responsive.containerMargin,
    marginTop: 10,
  },
  buttonTitle: {
    color: COLORS.WHITE,
    fontFamily: "OpenSans-Bold",
    fontSize: Typography.bodyLarge,
    textShadowColor: COLORS.BLACK,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
    textTransform: "uppercase",
  },
  buttonDanger: {
    alignItems: "center",
    backgroundColor: COLORS.ERROR,
    borderRadius: 4,
    justifyContent: "center",
    height: responsive.minTouchTarget,
    marginHorizontal: responsive.containerMargin,
    marginTop: 10,
  },
});
