import { StyleSheet } from "react-native";

import { COLORS } from "../../constants/colors";
import { Typography } from "../../typography/responsive";

export default StyleSheet.create({
  sortButton: {
    width: 48,
    height: 48,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.MEDIUM_LIGHT_GRAY,
  },
  sortButtonText: {
    fontSize: Typography.subtitle,
  },
});
