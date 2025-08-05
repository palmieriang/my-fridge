import { StyleSheet } from "react-native";

import { Typography } from "../../typography/responsive";
import { responsive } from "../../utils/responsive";

export default StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#48bbec",
    borderRadius: 4,
    justifyContent: "center",
    height: responsive.minTouchTarget,
    marginHorizontal: responsive.containerMargin,
    marginTop: 10,
  },
  buttonTitle: {
    color: "#fff",
    fontFamily: "OpenSans-Bold",
    fontSize: Typography.bodyLarge,
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
    textTransform: "uppercase",
  },
  buttonDelete: {
    backgroundColor: "#e74c3c",
  },
});
