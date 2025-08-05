import { StyleSheet } from "react-native";
import { COLORS } from "src/constants/colors";

import { Typography } from "../../typography/responsive";
import { vh } from "../../utils/responsive";

export default StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  animationContainer: {
    backgroundColor: COLORS.WHITE,
    alignItems: "center",
    height: vh(35),
  },
  footerView: {
    alignItems: "center",
    flex: 1,
    marginTop: 20,
  },
  footerText: {
    color: COLORS.DARK_GRAY,
    fontFamily: "OpenSans-Regular",
    fontSize: Typography.caption,
    padding: 10,
  },
  footerLink: {
    color: COLORS.PRIMARY_BLUE,
    fontFamily: "OpenSans-Bold",
    fontSize: Typography.body,
    padding: 10,
  },
});
