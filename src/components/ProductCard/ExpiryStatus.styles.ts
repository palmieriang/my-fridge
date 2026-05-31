import { StyleSheet } from "react-native";

import { Typography } from "../../typography/responsive";

export default StyleSheet.create({
  counterContainer: {
    alignItems: "baseline",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  counterText: {
    fontFamily: "OpenSans-Bold",
    fontSize: Typography.display,
  },
  counterLabel: {
    fontFamily: "OpenSans-Light",
    fontSize: Typography.caption,
    marginLeft: 10,
  },
  expired: {
    fontFamily: "LilitaOne-Regular",
    fontSize: Typography.display,
    textTransform: "uppercase",
  },
});
