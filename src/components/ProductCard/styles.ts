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
  },
  counterContainer: {
    alignItems: "baseline",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  counterText: {
    fontFamily: "OpenSans-Bold",
    fontSize: Typography.display,
  },
  counterLabel: {
    fontFamily: "OpenSans-Light",
    fontSize: Typography.caption,
    marginLeft: 10,
  },
  expired: {
    fontFamily: "LilitaOne-Regular",
    fontSize: Typography.display,
    textTransform: "uppercase",
  },
});
