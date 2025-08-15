import { StyleSheet } from "react-native";

import { Typography } from "../../typography/responsive";

export default StyleSheet.create({
  passwordStrengthContainer: {
    marginHorizontal: 20,
    marginTop: -15,
    marginBottom: 10,
  },
  strengthBarContainer: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 5,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: Typography.caption,
    fontFamily: "OpenSans-Regular",
    textAlign: "center",
  },
});
