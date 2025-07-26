import { StyleSheet } from "react-native";

import { Typography } from "../../typography/responsive";
import { responsive } from "../../utils/responsive";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  inputContainer: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    marginTop: 10,
    marginBottom: 25,
    marginLeft: responsive.containerPadding,
    marginRight: responsive.containerPadding,
    overflow: "visible",
    position: "relative",
  },
  pickerError: {
    borderColor: "#dd2c00",
    borderWidth: 1,
  },
  pickerErrorText: {
    position: "absolute",
    bottom: -20,
    color: "#dd2c00",
    fontFamily: "OpenSans-Regular",
    fontSize: Typography.caption,
  },
  iosHeight: {
    height: 120,
  },
  pickerPlaceholder: {
    color: "#636c72",
    fontSize: Typography.body,
  },
  androidPicker: {
    color: "#636c72",
    fontSize: Typography.body,
  },
});
