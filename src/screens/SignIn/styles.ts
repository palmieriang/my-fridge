import { StyleSheet } from "react-native";

import { Typography } from "../../typography/responsive";
import { vh } from "../../utils/responsive";

export default StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  animationContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    height: vh(35),
  },
  footerView: {
    alignItems: "center",
    flex: 1,
    marginTop: 20,
  },
  footerText: {
    color: "#2e2e2d",
    fontFamily: "OpenSans-Regular",
    fontSize: Typography.caption,
    padding: 10,
  },
  footerLink: {
    color: "#48bbec",
    fontFamily: "OpenSans-Bold",
    fontSize: Typography.body,
    padding: 10,
  },
});
