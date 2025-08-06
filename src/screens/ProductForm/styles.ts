import { StyleSheet } from "react-native";
import { COLORS } from "src/constants/colors";

import { Typography } from "../../typography/responsive";
import { responsive } from "../../utils/responsive";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  inputContainer: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.MEDIUM_DARK_GRAY,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: responsive.containerMargin,
    overflow: "visible",
    position: "relative",
  },
  pickerError: {
    borderColor: COLORS.ERROR,
    borderWidth: 1,
  },
  pickerErrorText: {
    position: "absolute",
    bottom: -20,
    color: COLORS.ERROR,
    fontFamily: "OpenSans-Regular",
    fontSize: Typography.caption,
  },
  iosHeight: {
    height: 120,
  },
  pickerPlaceholder: {
    fontSize: Typography.caption,
  },
});
