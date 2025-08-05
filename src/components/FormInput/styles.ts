import { StyleSheet } from "react-native";

import { Typography } from "../../typography/responsive";
import { responsive } from "../../utils/responsive";

export default StyleSheet.create({
  inputContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: responsive.containerMargin,
    maxHeight: 56,
    overflow: "visible",
    position: "relative",
  },
  iconStyle: {
    alignItems: "center",
    borderRightColor: "#ccc",
    borderRightWidth: StyleSheet.hairlineWidth,
    padding: 14,
  },
  input: {
    backgroundColor: "white",
    flex: 1,
    fontFamily: "OpenSans-Regular",
    fontSize: Typography.body,
    justifyContent: "center",
    padding: 14,
  },
  inputError: {
    borderColor: "#dd2c00",
    borderWidth: 1,
  },
  errorText: {
    position: "absolute",
    bottom: -20,
    color: "#dd2c00",
    fontFamily: "OpenSans-Regular",
    fontSize: Typography.caption,
  },
});
