import { StyleSheet } from "react-native";

import { Typography } from "../../typography/responsive";
import { responsive } from "../../utils/responsive";

export default StyleSheet.create({
  card: {
    alignItems: "flex-end",
    flex: 1,
    flexWrap: "wrap",
    padding: responsive.containerPadding,
    flexDirection: "row",
    justifyContent: "space-between",
    margin: responsive.containerMargin,
    marginVertical: 5,
    borderRadius: 4,
  },
  date: {
    fontSize: Typography.caption,
    marginBottom: 10,
    fontFamily: "OpenSans-Light",
  },
  title: {
    fontFamily: "OpenSans-Regular",
    fontSize: Typography.bodyLarge,
    marginBottom: 10,
    marginTop: 5,
    flexShrink: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  quantityBadge: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 3,
  },
  quantityMultiplier: {
    fontFamily: "OpenSans-Light",
    fontSize: Typography.caption,
    color: "#666",
  },
  quantityNumber: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: Typography.body,
  },
});
