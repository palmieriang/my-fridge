import { StyleSheet } from "react-native";

import { Typography } from "../../typography/responsive";

export default StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  selectorContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginTop: 20,
    minWidth: 200,
  },
  initValueTextStyle: {
    color: "black",
    fontFamily: "OpenSans-Regular",
  },
  text: {
    fontFamily: "OpenSans-Regular",
  },
  optionContainer: {
    backgroundColor: "lightgrey",
  },
  auth: {
    marginTop: 20,
  },
  authLink: {
    color: "#dd2c00",
    fontFamily: "OpenSans-Bold",
    fontSize: Typography.body,
    marginTop: 20,
  },
});
