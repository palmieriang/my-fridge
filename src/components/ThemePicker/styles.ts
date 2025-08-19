import { StyleSheet } from "react-native";

import { COLORS } from "../../constants/colors";
import { Typography } from "../../typography/responsive";
import { responsive } from "../../utils/responsive";

export default StyleSheet.create({
  label: {
    fontSize: Typography.body,
    fontFamily: "OpenSans-SemiBold",
    marginHorizontal: responsive.containerMargin,
    marginTop: 20,
    marginBottom: 8,
  },
  selectorContainer: {
    borderColor: COLORS.MEDIUM_LIGHT_GRAY,
    borderRadius: 4,
    borderWidth: 1,
    marginHorizontal: responsive.containerMargin,
    marginTop: 0,
    minWidth: 200,
    overflow: "hidden",
  },
});
