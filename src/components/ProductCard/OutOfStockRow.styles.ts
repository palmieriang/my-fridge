import { StyleSheet } from "react-native";

import { Typography } from "../../typography/responsive";

export default StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 8,
  },
  label: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: Typography.caption,
  },
  shoppingListNudge: {
    fontFamily: "OpenSans-Regular",
    fontSize: Typography.caption,
    textDecorationLine: "underline",
  },
});
