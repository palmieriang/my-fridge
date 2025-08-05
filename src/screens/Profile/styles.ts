import { StyleSheet } from "react-native";
import { COLORS } from "src/constants/colors";

import { Typography } from "../../typography/responsive";
import { responsive } from "../../utils/responsive";

export default StyleSheet.create({
  profile: {
    alignItems: "center",
    paddingBottom: 30,
    width: "100%",
  },
  pictureContainer: {
    marginTop: 30,
  },
  picture: {
    height: responsive.avatarLarge,
    width: responsive.avatarLarge,
    borderRadius: responsive.avatarLarge / 2,
    position: "relative",
  },
  activityIndicatorOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: responsive.avatarLarge / 2,
    zIndex: 2,
  },
  profileField: {
    color: COLORS.WHITE,
    fontFamily: "OpenSans-Regular",
    fontSize: Typography.body,
    marginTop: 20,
  },
  progressContainer: {
    flex: 1,
    justifyContent: "center",
    maxHeight: 150,
  },
  deleteIcon: {
    bottom: 0,
    position: "absolute",
    right: 0,
  },
});
