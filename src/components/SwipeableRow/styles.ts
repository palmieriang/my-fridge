import { StyleSheet } from "react-native";

import { Typography } from "../../typography/responsive";

export default StyleSheet.create({
  actionButton: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginVertical: 5,
  },
  actionText: {
    color: "white",
    fontFamily: "OpenSans-Regular",
    fontSize: Typography.caption,
    backgroundColor: "transparent",
    padding: 10,
  },
});
