import { StyleSheet } from "react-native";

import { COLORS } from "../../constants/colors";
import { Typography } from "../../typography/responsive";

export default StyleSheet.create({
  container: {
    marginTop: 20,
  },
  deleteLink: {
    color: COLORS.ERROR,
    fontFamily: "OpenSans-Bold",
    fontSize: Typography.body,
    marginTop: 20,
    textAlign: "center",
  },
});
